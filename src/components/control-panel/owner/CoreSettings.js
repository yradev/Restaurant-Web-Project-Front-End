import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { getRoles } from "../../../Auth";
import { get, put } from "../../../Connection";
import NotAllowed from "../../errors/NotAllowed";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import Loading from "../../fragments/Loading";

export default function CoreSettings() {
    const [roles, setRoles] = useState();
    const { t } = useTranslation();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [contactsPhoneNumber, setPhone] = useState();
    const [firmName, setFirm] = useState();
    const [ownerNames, setOwner] = useState();
    const [location, setLocation] = useState();
    const [openDay, setOpenDay] = useState();
    const [closeDay, setCloseDay] = useState();
    const [openTime, setOpenHour] = useState();
    const [closeTime, setCloseHour] = useState();
    const [deliveryStatus, setIsOpenedForDeliveries] = useState();
    const [guestsStatus, setIsOpenedForGuests] = useState();
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        (async () => {
            const role = await getRoles();
            setRoles(role)
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const core = await get('/core');
            setName(core.name);
            setDescription(core.description);
            setOpenHour(core.openTime);
            setCloseHour(core.closeTime);
            core.guestsStatus != null ? setIsOpenedForGuests(core.guestsStatus) : setIsOpenedForGuests("CLOSE");
            core.openDay != null ? setOpenDay(core.openDay) : setOpenDay("MONDAY");
            core.closeDay != null ? setCloseDay(core.closeDay) : setCloseDay("MONDAY");
            setFirm(core.firmName);
            core.deliveryStatus != null ? setIsOpenedForDeliveries(core.deliveryStatus) : setIsOpenedForDeliveries("CLOSE");
            setOwner(core.ownerNames);
            setPhone(core.contactsPhoneNumber);
            setLocation(core.location);
        })();
    }, [t]);

    if (roles !== undefined && !roles.some(a => a === 'OWNER')) {
        return (<NotAllowed />)
    }

    if (name === undefined) {
        return (<Loading />);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const options = {
            name,
            description,
            openTime,
            closeTime,
            guestsStatus,
            openDay,
            closeDay,
            firmName,
            deliveryStatus,
            ownerNames,
            contactsPhoneNumber,
            location
        };


        await put("/core", options);
        setSaved(true);
    }

    function onChangeHandler(event) {
        setSaved(false);

        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'description': setDescription(value); break;
            case 'contactsPhoneNumber': setPhone(value); break;
            case 'firmName': setFirm(value); break;
            case 'ownerNames': setOwner(value); break;
            case 'location': setLocation(value); break;
            case 'openDay': setOpenDay(event.target.selectedOptions[0].value); break;
            case 'closeDay': setCloseDay(event.target.selectedOptions[0].value); break;
            case 'openTime': setOpenHour(value); break;
            case 'closeTime': setCloseHour(value); break;
            default: throw new Error('Nothing here!');
        }
    }

    const DayOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return (
            <header className="header wow fadeIn">
                <div className="overlay text-white text-left">
                    <Container style={{ padding: 40, backgroundColor: 'rgba(0, 0, 0, .30)', borderRadius: 25 }}>
                        <Form onSubmit={handleSubmit}>
                            {saved ? (
                                <div className="alert alert-success alert-dismissible  fade show" style={{ textAlign: 'center' }} role="alert">
                                    {t('coreSettingsSaved')}
                                </div>
                            ) : null}
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('restaurantNameLabel')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            name="name"
                                            value={name == null ? '' : name}
                                            onChange={onChangeHandler}
                                            placeholder={t('restaurantNamePlaceHolder')} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('restaurantDescriptionLabel')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            name="description"
                                            value={description == null ? '' : description}
                                            onChange={onChangeHandler}
                                            placeholder={t('restaurantDescriptionPlaceHolder')} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('phoneForContactsLabel')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            name="contactsPhoneNumber"
                                            value={contactsPhoneNumber == null ? '' : contactsPhoneNumber}
                                            onChange={onChangeHandler}
                                            placeholder={t('phoneForContactsPlaceHolder')} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('firmNameLabel')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            name="firmName"
                                            value={firmName == null ? '' : firmName}
                                            onChange={onChangeHandler}
                                            placeholder={t('firmNamePlaceHolder')} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('ownerNamesLabel')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            name="ownerNames"
                                            value={ownerNames == null ? '' : ownerNames}
                                            onChange={onChangeHandler}
                                            placeholder={t('ownerNamesPlaceHolder')} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('locationLabel')}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            required
                                            name="location"
                                            value={location == null ? '' : location}
                                            onChange={onChangeHandler}
                                            placeholder={t('locationPlaceHolder')} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ paddingTop: 45 }}>
                                    <BootstrapSwitchButton
                                        width='80'
                                        checked={guestsStatus === 'OPEN' ? true : false}
                                        onChange={(value)=>setIsOpenedForGuests(value ? 'OPEN' : 'CLOSE')}
                                        onstyle="dark"
                                        offstyle="dark"
                                        onlabel={t('OpenButton')}
                                        offlabel={t('CloseButton')}
                                    />  <span style={{ fontSize: 15, fontWeight: 'bold' }}>{t('guestStatusLabel')}</span>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('openDayLabel')}</Form.Label>
                                        <Form.Select className="form-control" size="lg"
                                            onChange={onChangeHandler}
                                            name='openDay'>
                                                
                                            {DayOfWeek.map(a => a === openDay ?
                                                (<option key={a} value={a==null?'':a}>{a.substring(0, 1) + a.substring(1).toLowerCase()}</option>) :
                                                (<option key={a} value={a==null?'':a}>{a.substring(0, 1) + a.substring(1).toLowerCase()}</option>)
                                            )};
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('openTimeLabel')}</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="openTime"
                                            required
                                            value={openTime==null?'':openTime}
                                            onChange={onChangeHandler} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col style={{ paddingTop: 10 }} className="mb-3">
                                    <BootstrapSwitchButton
                                        width='80'
                                        checked={deliveryStatus === 'OPEN' ? true : false}
                                        onChange={(value)=>setIsOpenedForDeliveries(value ? 'OPEN' : 'CLOSE')}
                                        onstyle="dark"
                                        offstyle="dark"
                                        onlabel={t('OpenButton')}
                                        offlabel={t('CloseButton')}
                                    /> <span style={{ fontSize: 15, fontWeight: 'bold' }}>{t('deliveryStatusLabel')}</span>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>{t('closeDayLabel')}</Form.Label>
                                        <Form.Select
                                            className="form-control"
                                            name='closeDay'
                                            size="lg"
                                            onChange={onChangeHandler}>
                                            {DayOfWeek.map(a => a === closeDay ?
                                                (<option key={a} value={a==null?'':a}>{a.substring(0, 1) + a.substring(1).toLowerCase()}</option>) :
                                                (<option key={a} value={a==null?'':a}>{a.substring(0, 1) + a.substring(1).toLowerCase()}</option>)
                                            )}
                                        </Form.Select>
                                    </Form.Group></Col>
                                <Col>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>{t('closeTimeLabel')}</Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="text"
                                            required
                                            value={closeTime==null?'':closeTime}
                                            onChange={onChangeHandler}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button style={{ float: 'left' }} variant="primary" type="submit">
                                {t('submitButton')}
                            </Button>
                        </Form>
                    </Container>
                </div>
            </header >
    );
}