export function getUserData() {
    return JSON.parse(localStorage.getItem('userData'));
};

export function setUserData(data) {
    localStorage.setItem('userData', JSON.stringify(data));
};

export function setRememberMe(data) {
    localStorage.setItem('rememberMe', JSON.stringify(data));
};

export function getLoggedUserEmail() {
    return getUserData().user;
};

export function getRememberMe() {
    return JSON.parse(localStorage.getItem('rememberMe'));
};

export function getItemsFromDeliveryBag() {
    let data = localStorage.getItem('deliveriesBag');
    if (data == null) {
        localStorage.setItem('deliveriesBag', JSON.stringify([]))
        return [];
    }

    return JSON.parse(localStorage.getItem('deliveriesBag'));
};

export function getFavoriteITems() {
    return JSON.parse(localStorage.getItem('favorites'));
};

export async function setLoginDetails(authToken, user) {
    let data = getUserData();

    if (data == null) {
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 1);
        data = { authToken, user, expireDate }
    } else {
        data.authToken = authToken;
        data.user = user;
    }

    setUserData(data);
};

export function removeToken() {
    let data = getUserData();
    delete data.authToken;
    setUserData(data);
};


export function rememberMe(email, password) {
    const data = {};

    const cryptoJS = require("crypto-js");

    data.email = email;
    data.password = cryptoJS.AES.encrypt(password, 'm//32le./wmk2ee3`1m,ek2;wo22../2wm').toString();

    setRememberMe(data);
};

export function checkRememberMe() {
    return getRememberMe() != null;
};

export function getRememberedLoginData() {
    const data = getRememberMe();

    if (data != null) {
        const email = data.email;
        const password = data.password;

        if (email != null && password != null) {
            return { email, password }
        } else {
            return null;
        }
    }

    return data;
};

export function cleanRememberMeData() {
    localStorage.removeItem('rememberMe');
};

export function isUserLogged() {
    const userData = getUserData();
    if (userData == null || userData.authToken == null) {
        return false;
    } else {
        const date = new Date();
        if (date > userData.expireDate) {
            removeToken();
            return false;
        }

        return true;
    };
};

export function getLanguage() {
    return localStorage.getItem("i18nextLng");
};

export function getCurrentLang() {
    return localStorage.getItem('i18nextLng');
};

export function addFavoriteItem(categoryPosition, itemPosition) {
    const data = getFavoriteITems();
    if (data == null) {
        localStorage.setItem('favorites', JSON.stringify([{ categoryPosition, itemPosition }]));
    } else {
        if (!data.some(a => a.categoryPosition === categoryPosition && a.itemPosition === itemPosition)) {
            data.push({ categoryPosition, itemPosition });
            localStorage.setItem('favorites', JSON.stringify(data));
        }
    }
};

export function removeFavoriteItem(categoryPosition, itemPosition) {

    localStorage
        .setItem('favorites',
            JSON.stringify(
                getFavoriteITems()
                    .filter(a => !(a.categoryPosition == categoryPosition && a.itemPosition == itemPosition))
            ));
}

export function checkItemInFavorites(categoryPosition, itemPosition) {
    const data = getFavoriteITems()

    if (data == null) {
        return false;
    }

    return data.some(a => a.categoryPosition === categoryPosition && a.itemPosition === itemPosition);
}


export function addItemToDeliveryBag(categoryPosition, itemPosition) {

    const data = getItemsFromDeliveryBag();;

    const item = data.filter(a => a.categoryPosition === categoryPosition && a.itemPosition === itemPosition)[0];
    if (item != null) {
        item.count = item.count + 1;
    } else {
        data.push({ categoryPosition, itemPosition, count: 1 });
    }

    localStorage.setItem('deliveriesBag', JSON.stringify(data));
};

export function removeItemFromDeliveryBag(categoryPosition, itemPosition) {
    const data = getItemsFromDeliveryBag();;

    const item = data.filter(a => a.categoryPosition === categoryPosition && a.itemPosition === itemPosition)[0];
    if (item != null) {
        item.count = item.count + -1;
        localStorage.setItem('deliveriesBag', JSON.stringify(data));

    }
}

export function checkItemsAvaliableInDeliveryBag() {
    return getItemsFromDeliveryBag() != null;
}