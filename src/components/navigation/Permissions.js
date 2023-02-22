import Button from 'react-bootstrap/Button';
import Login from "../auth/Login"
import Register from "../auth/Register"
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { getRoles } from '../../Auth';
import { AuthenticationContext } from '../../Contexts';
import { removeToken } from '../../Storage';
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';

export const NotLoggedUSer = () => {
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    const [notification, setNotification] = useState();

    const { t } = useTranslation();

    return (<>
        <li className="nav-item" style={{ paddingRight: 5, paddingLeft: 15 }}>
            <Button variant="success" onClick={() => setLogin(true)}>
                {t("loginNavigation")}
            </Button>
        </li>
        <li className="nav-item">
            <Button variant="danger" onClick={() => setRegister(true)}>
                {t("registerNavigation")}
            </Button>
        </li>

        {login ? (<Login setLogin={setLogin} notification={notification} />) : (null)}
        {register ? (<Register setRegister={setRegister} setLogin={setLogin} setNotification={setNotification} />) : (null)}

    </>)
}

export const LoggedUser = () => {
    const [roles, setRoles] = useState();
    const navigate = useNavigate();
    const authentication = useContext(AuthenticationContext);

    useEffect(() => {
        (async function fillRoles() {
            const role = await getRoles();
            setRoles(role)
        })();
    }, []);

    const { t } = useTranslation();

    function logoutHandler() {
        authentication.changeLogin(false);
        removeToken();
        navigate('/');
    }

    
    return (<>
        <li className="nav-item">
            <div className="dropdown d-inline-block">
                <button
                    className="btn btn-transperant dropdown-toggle"
                    style={{ border: 'none', marginLeft: -5 }}
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">

                    <svg style={{ marginBottom: '6%', marginRight: '5%' }}
                        xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="orange" className="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>
                    <span style={{ fontWeight: 'bold', fontSize: 'large' }}>{t('controlPanelNavigation')}</span>

                </button>

                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <h1
                        className="dropdown-header"
                        style={{ textDecoration: 'underline', textUnderlinePosition: 'under' }}>
                        {t('controlPanelDropdownMenuUserHeader')}
                    </h1>

                    <Link to="#" className="dropdown-item">{t('controlPanelDropdownUserSettings')}</Link>
                    <Link to="#" className="dropdown-item">{t('controlPanelDropdownUserDeliveries')}</Link>
                    <Link to="#" className="dropdown-item">{t('controlPanelDropdownUserReservations')}</Link>

                    {roles !== undefined && roles.some(a => a === "STAFF") ? (
                        <>
                            <div className="dropdown-divider" />
                            <h1
                                className="dropdown-header"
                                style={{
                                    textDecoration: 'underline',
                                    textUnderlinePosition: 'under'
                                }}>
                                {t('controlPanelDropdownMenuStaffHeader')}</h1>

                            <Link to="#" className="dropdown-item">{t('controlPanelDropdownStaffDeliveries')}</Link>
                            <Link to="#" className="dropdown-item">{t('controlPanelDropdownStaffResrvations')}</Link>
                        </>
                    ) : (null)}

                    {roles !== undefined && roles.some(a => a === "OWNER") ? (
                        <>
                            <div className="dropdown-divider"></div>
                            <h1 className="dropdown-header" style={{
                                textDecoration: 'underline',
                                textUnderlinePosition: 'under'
                            }}>{t('controlPanelDropdownMenuOwnerHeader')}</h1>
                            <Link to="/settings/owner/core" className="dropdown-item">{t('controlPanelDropdownOwnerCore')}</Link>
                            <Link to="/settings/owner/user" className="dropdown-item">{t('controlPanelDropdownOwnerUserControl')}</Link>
                            <Link to="/settings/owner/menu" className="dropdown-item">{t('controlPanelDropdownOwnerMenuControl')}</Link>
                        </>
                    ) : (null)}

                    <div className="dropdown-divider" />

                    <button
                        className="dropdown-item"
                        onClick={logoutHandler}>
                        {t('controlPanelDropdownLogout')}
                    </button>
                </div>
            </div>
        </li>
    </>)
}