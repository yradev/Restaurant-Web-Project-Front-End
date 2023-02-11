import { Link } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { NotLoggedUSer, LoggedUser } from "./Permissions";
import { isUserLogged } from "../../Storage";
import { useTranslation } from "react-i18next";
import { AuthenticationContext, DeliveryBagContext, FavoritesContext } from "../../Contexts";
import { Spinner } from "react-bootstrap";
import Favorites from "../items/Favorites";
import DeliveryBag from "../items/DeliveryBag/DeliveryBag";

function AppNavigation() {
    const { t } = useTranslation();
    const favorites = useContext(FavoritesContext);
    const deliveryBag = useContext(DeliveryBagContext)

    const [authentication, setAuthentication] = useState({
        isLogged: isUserLogged(),
        changeLogin
    });

    function changeLogin(value) {
        setAuthentication({
            isLogged: value,
            changeLogin
        })
    }

    return (
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/">{t("homeNavigation")}</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/menu">{t("menuNavigation")}</Link>

                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#gallary">{t("aboutUsNavigation")}</a>
                </li>
            </ul>
            <AuthenticationContext.Provider value={authentication}>
            <ul className="navbar-nav" >
                <li className="nav-item">
                    <div className="dropdown d-inline-block">
                        <button
                            className="btn btn-transperant dropdown-toggle"
                            style={{ border: 'none', marginLeft: 100 }}
                            type="button"
                            id="dropdownFavorites"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            {favorites.items == null || favorites.items.length === 0 ?
                                <svg style={{ marginBottom: '3%', marginRight: '5%' }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="green"
                                    className="bi bi-heart" viewBox="0 0 16 16">
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                                :
                                <svg style={{ marginBottom: '3%', marginRight: '5%' }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="green"
                                    className="bi bi-heart"
                                    viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                </svg>
                            }
                            <span style={{ fontWeight: 'bold', fontSize: 'large' }}>{t('favoritesNavigation')}</span>

                        </button>
                        <Favorites />
                    </div>

                </li>
                <li className="nav-item">
                    <div className="dropdown d-inline-block">
                        <button
                            className="btn btn-transperant dropdown-toggle"
                            style={{ border: 'none' }}
                            type="button"
                            id="dropDownDeliveryBag"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false">
                            <svg style={{ marginBottom: '5%', marginRight: '3%' }} xmlns="http://www.w3.org/2000/svg"
                                width="20" height="20" fill="green" className="bi bi-cart-fill" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                            </svg>
                            <span style={{ fontWeight: 'bold', fontSize: 'large' }}>{t('deliveryBagNavigation')}</span>
                        </button>
                        <DeliveryBag />
                    </div>
                </li>
                    {!authentication.isLogged ? (<NotLoggedUSer />) : (<LoggedUser />)}
            </ul>
            </AuthenticationContext.Provider>
        </div>
    );
}

export default function Navigation() {
    return (
        <Suspense fallback={<Spinner />}>
            <AppNavigation />
        </Suspense>
    );
};