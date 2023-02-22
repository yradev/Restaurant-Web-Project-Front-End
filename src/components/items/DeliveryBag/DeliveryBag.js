import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Button, Col, Container, Dropdown, Row } from "react-bootstrap";
import { get } from "../../../Connection";
import { AuthenticationContext, DeliveryBagContext } from "../../../Contexts";
import Login from "../../auth/Login";
import Loading from "../../fragments/Loading";
import SendDelivery from "./SendDelivery";
import ItemsView from "./ItemsView";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

export default function DeliveryBag() {
    const [showDeliveryBag, setShowDeliveryBag] = useState(false);
    const [items, setItems] = useState();
    const [isLoginOpened, setIsLoginOpened] = useState(false);
    const [isContinueOpened, setIsContinueOpened] = useState(false);
    const [timer,setTimer] = useState();
    const { t } = useTranslation();


    const deliveryBagContext = useContext(DeliveryBagContext);
    const authentication = useContext(AuthenticationContext);

    useEffect(() => {
        if (deliveryBagContext.items.length === 0) {
            setItems([]);
            return;
        }
        (async () => {
            const result = await Promise.all(deliveryBagContext.items.map(
                async (i) => {
                    const tempItem = await get('/items/category/' + i.categoryPosition + '/item/' + i.itemPosition);
                    tempItem.count = i.count;
                    tempItem.total = tempItem.price * i.count;
                    return tempItem;
                }));

            setItems(result);

        })()
    }, [deliveryBagContext]);

    if (items === undefined) {
        return <Loading />
    }

    function addDeliveryHandler() {
        if (!authentication.isLogged) {
            setIsLoginOpened(true);
        } else {
            setShowDeliveryBag(false);
            setIsContinueOpened(true);
        }
    }

    function NotEmptyView() {
        return (<>
            <Container>
                <Row style={{ overflow: 'auto', maxHeight: '300px' }}>
                    <ItemsView items={items} />
                </Row>
                <Row style={{
                    padding: '15px',
                    fontSize: 'large',
                    fontStyle: 'italic'
                }}>
                    Total price is 25.00 BGN.
                </Row>
                <Row>
                    <Col>
                        <Button style={{ width: '95%', borderRadius: 25, marginBottom: 10 }} onClick={addDeliveryHandler}>Continue delivery</Button>
                    </Col>
                </Row>
            </Container>
            {isLoginOpened ? (
                <Login
                    setLogin={setIsLoginOpened}
                    notification={'You need to Login to continue!'}
                />) :
                null}
            {isContinueOpened ? (
                <SendDelivery
                    modalOpened={setIsContinueOpened}
                    items={items}
                    notification={'You need to Login to continue!'}
                />) :
                null}
        </>)
    }

    return (<>
        <Dropdown
            show={showDeliveryBag}
            onMouseEnter={() => {
                if (!isContinueOpened) {
                    clearTimeout(timer)
                    setShowDeliveryBag(true)
                }
            }}
            onMouseLeave={() => {
                if (!isContinueOpened) {
                    setTimer(setTimeout(() => {
                        setShowDeliveryBag(false);
                    }, 500));
                }
            }}>

            <Dropdown.Toggle
                style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    pointerEvents: 'none',
                }}
                id="dropdown-custom-components">
                <FontAwesomeIcon icon={faCartShopping} style={{
                    paddingRight: 6,
                    color: 'green'
                }} />
                <span style={{ fontWeight: 'bold', fontSize: 'large', color: '#20b3bb' }}>{t('deliveryBagNavigation')}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{
                width: '270px',
                color: 'black',
                backgroundColor: 'silver',
                borderRadius: '25px/40px',
                padding: '5px',
                margin: 0
            }}>

                {items.length > 0 ? <NotEmptyView /> : (<>
                    We dont have added deliveries in bag, yet!
                </>)}
            </Dropdown.Menu>
        </Dropdown>
    </>)
}