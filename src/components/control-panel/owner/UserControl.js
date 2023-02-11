import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getRoles } from "../../../Auth";
import { get, put } from "../../../Connection";
import { getLoggedUserEmail } from "../../../Storage";
import NotAllowed from "../../errors/NotAllowed";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


export default function UserControl() {
    const [roles, setRoles] = useState();
    const [userFound, setUserFound] = useState(false);
    const [email, setEmail] = useState();
    const { t } = useTranslation();
    const emailRef = useRef();
    const [error, setError] = useState();
    const [roleStaff, setRoleStaff] = useState();
    const [roleOwner, setRoleOwner] = useState();
    const [userStatus, setUSerStatus] = useState();
    const [savedData, setSavedData] = useState(false);

    useEffect(() => {
        (async () => {
            const role = await getRoles();
            setRoles(role);
        })();
    }, []);

    useEffect(() => {
        if (email != null) {
            if (email === getLoggedUserEmail()) {
                setError(t('CantChangeOwnSettingsError'));
                return;
            }

            (async () => {
                try {
                    const data = await get('/user/control/' + email);
                    setUserFound(true);
                    setRoleStaff(data.roles.some(x => x.name === 'ROLE_STAFF'));
                    setRoleOwner(data.roles.some(x => x.name === 'ROLE_OWNER'));
                    setUSerStatus(data.enabled);
                } catch (error) {
                    setError(t('NotFoundUserWithEmail'));
                }
            })();
        }
    }, [email, t]);


    if (roles !== undefined && !roles.some(a => a === 'OWNER')) {
        return (<NotAllowed />)
    }

    function onSubmitHandler(event) {
        event.preventDefault();

        if (!userFound) {
            setEmail(emailRef.current.value)
        } else {
            const options = { enabled: userStatus, roles: [] }
            if (roleStaff) {
                options.roles.push({ name: 'ROLE_STAFF' });
            }

            if (roleOwner) {
                options.roles.push({ name: 'ROLE_OWNER' });
            }

            put('/user/control/' + email, options);
            setSavedData(true)
        }
    }

    return (
        <header className="header wow fadeIn">
            <div className="overlay text-white text-left">
                <header className="header wow fadeIn">
                    <div className="overlay text-white text-left">
                        <Container style={{ padding: 40, backgroundColor: 'rgba(0, 0, 0, .30)', borderRadius: 25 }}>
                            <Row>
                                <Col style={{ width: 400 }}>
                                    <Form onSubmit={onSubmitHandler}>
                                        {savedData ? (
                                            <div className="alert alert-success alert-dismissible  fade show"
                                                style={{ textAlign: 'center' }}
                                                role="alert">
                                                {t('coreSettingsSaved')}
                                            </div>
                                        ) : null}

                                        <Form.Group className="mb-3" controlId="formBasicEmail">
                                            <Form.Label>{t('userControlEmailAddressLabel')}</Form.Label>
                                            <Form.Control
                                                style={{ width: '70%', float: 'left' }}
                                                type="text"
                                                ref={emailRef}
                                                required
                                                name="email"
                                                onChange={() => { setUserFound(null); setEmail(null); setError(null); setSavedData(false) }}
                                                placeholder='Email'
                                                isInvalid={error != null} />

                                            {!userFound ? (
                                                <Button style={{ float: 'right' }} variant="primary" type="submit">
                                                    {t('submitButton')}
                                                </Button>) : null}
                                            <Form.Control.Feedback type='invalid' style={{ float: 'left', fontWeight: 600 }}>{error}</Form.Control.Feedback>
                                        </Form.Group>

                                    </Form>
                                </Col>
                            </Row>
                            {userFound ? (
                                <Form onSubmit={onSubmitHandler}>
                                    <Row>
                                        <Col style={{ textAlign: 'center' }}>
                                            <Container style={{ paddingTop: 15 }}>
                                                <Row>
                                                    <p style={{ fontSize: 25, fontWeight: 'bold' }}>
                                                        {t('userControlRolesLabel')}
                                                    </p>

                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>

                                                    <BootstrapSwitchButton
                                                        width='90'
                                                        checked={roleStaff}
                                                        onChange={(value) => { setRoleStaff(value); setSavedData(false) }}
                                                        onstyle="dark"
                                                        offstyle="dark"
                                                        onlabel='Active'
                                                        offlabel='Disabled'
                                                    />
                                                    <span style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, paddingTop: 3 }}>
                                                        {t('userRoleStaff')}
                                                    </span>
                                                </Row>
                                                <Row>
                                                    <BootstrapSwitchButton
                                                        checked={roleOwner}
                                                        onChange={(value) => { setRoleOwner(value); setSavedData(false); }}
                                                        width='90'
                                                        onstyle="dark"
                                                        offstyle="dark"
                                                        onlabel='Active'
                                                        offlabel='Disabled'
                                                    />
                                                    <span style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 10, paddingTop: 3 }}>
                                                         {t('userRoleOwner')}</span>
                                                </Row>
                                            </Container>
                                        </Col>
                                        <Col style={{ textAlign: 'center' }}>
                                            <Container style={{ paddingTop: 15 }}>
                                                <Row>
                                                    <p style={{ fontSize: 25, fontWeight: 'bold' }}>{t('userControlUserLabel')}</p>

                                                </Row>
                                                <Row style={{ marginBottom: 10 }}>

                                                    <BootstrapSwitchButton
                                                        checked={userStatus}
                                                        onChange={(value) => { setUSerStatus(value); setSavedData(false) }}

                                                        width='90'
                                                        onstyle="dark"
                                                        offstyle="dark"
                                                        onlabel='Active'
                                                        offlabel='Disabled'
                                                    />
                                                    <span style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, paddingTop: 3 }}>
                                                        {t('userControlAccountStatusLabel')}
                                                    </span>
                                                </Row>
                                                <Row>
                                                    <Button style={{ width: '100%' }} variant="primary" type="submit">
                                                        {t('submitButton')}
                                                    </Button></Row>
                                            </Container>
                                        </Col>
                                    </Row>
                                </Form>
                            ) : null}
                        </Container>
                    </div>
                </header>
            </div>
        </header>)
}