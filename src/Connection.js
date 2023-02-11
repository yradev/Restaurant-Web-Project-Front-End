import { getCurrentLang, getUserData } from "./Storage";

export function get(url) {
    return NewRequest(url, 'get');
}

export function post(url, data) {
    return NewRequest(url, 'post', data);
}

export function put(url, data) {
    return NewRequest(url, 'put', data);
}

export function del(url, data) {
    return NewRequest(url, 'delete', data);
}

async function NewRequest(url, method, data) {

    const host = 'http://localhost:8080';
    const userData = getUserData();
    const currentLang = getCurrentLang();

    const options = {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept-Language': currentLang },
    };

    if (data !== undefined) {
        options.body = JSON.stringify(data);
    };

    if (userData !== null) {
        if (userData.authToken !== undefined) {
            options.headers['Authorization'] = userData.authToken;
        }
    }

    try {
        const response = await fetch(host + url, options);

        if (response.status < 200 || response.status > 201 || response.ok === false) {
            throw new Error(response.status);
        }
    

        if (response.headers.get("content-type") != null) {
        if (response.headers.get("content-type").includes("text")) {
            return response.text();
        } else {
            return response.json();
        }
    }

} catch (error) {
    if (error.message === 'NetworkError when attempting to fetch resource.') {
        return alert('Server is down!')
    } else {
        throw error;
    }
}
};