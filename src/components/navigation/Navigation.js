import { Link } from "react-router-dom";
import { Suspense, useContext, useState } from "react";
import { NotLoggedUSer, LoggedUser } from "./Permissions";
import { isUserLogged } from "../../Storage";
import { useTranslation } from "react-i18next";
import { AuthenticationContext, DeliveryBagContext, DeliveryContinueOpenedContext, FavoritesContext } from "../../Contexts";
import { Dropdown, Spinner } from "react-bootstrap";
import Favorites from "../items/Favorites/Favorites";
import DeliveryBag from "../items/DeliveryBag/DeliveryBag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";

function AppNavigation() {
    const { t } = useTranslation();
    const favorites = useContext(FavoritesContext);
    const deliveryBag = useContext(DeliveryBagContext)
    const [showFavorites, setShowFavorites] = useState(false);

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
                        <Dropdown
                            show={showFavorites}
                            onMouseEnter={() => {
                                setShowFavorites(true)
                            }}
                            onMouseLeave={() => {
                                setTimer(setTimeout(() => {
                                    setShowFavorites(false);
                                }, 500));
                            }}>

                            <Dropdown.Toggle
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    pointerEvents: 'none',
                                }}
                                id="dropdown-custom-components">
                                <FontAwesomeIcon icon={faHeart} style={{
                                    paddingRight: 6,
                                    color: 'green'
                                }} />
                                <span style={{
                                    fontWeight: 'bold',
                                    fontSize: 'large',
                                    color: '#20b3bb'
                                }}>
                                    {t('favoritesNavigation')}
                                </span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{
                                width: '270px',
                                color: 'black',
                                backgroundColor: 'silver',
                                borderRadius: '25px/40px',
                                padding: '5px',
                                margin: 0
                            }}>
                                <Favorites />
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>

                    <li className="nav-item">
                           
                           <DeliveryBag timer={timer} setTimer={setTimer} />
                    </li>
                    {!authentication.isLogged ? (<NotLoggedUSer />) : (<LoggedUser />)}
                </ul>
            </AuthenticationContext.Provider>
        </div >
    );
}

export default function Navigation() {
    return (
        <Suspense fallback={<Spinner />}>
            <AppNavigation />
        </Suspense>
    );
};