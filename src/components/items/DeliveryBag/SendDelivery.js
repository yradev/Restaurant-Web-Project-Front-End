import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Form, Modal, ModalBody, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { get, post } from "../../../Connection";
import Loading from "../../fragments/Loading";
import Pagination from "../../fragments/Pagination";
import { SendDeliveryItems } from "./ItemsView";

export default function SendDelivery({ items, modalOpened }) {
    const [show, setShow] = useState(true);
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null)
    const [page, setPage] = useState(0);
    const [deliveryItems, setDeliveryItems] = useState();
    const { t } = useTranslation();


    useEffect(()=>{
        if(items==undefined){
            return;
        }

        const itemsSplitBy3 = []

        for (let index = 0; index <= items.length; index += 5) {
            const currentItem = items
                .filter(a => items.indexOf(a) >= index)
                .slice(0, 5);
            itemsSplitBy3.push(currentItem);
        };

        setDeliveryItems(itemsSplitBy3);
    },[items])


    if(deliveryItems===undefined){
        return <Loading />;
    }

    function handleClose() {
        setShow(false);
        modalOpened(false);
    };

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'address': setAddress(value); break;
            default: throw new Error();
        };
    };


    async function onSubmitHandler(event) {
        event.preventDefault();

        try {
            await post('/deliveries/add', {
                address: address,
                receivedTime: new Date(),
                items: items.map(a => {
                    return {
                        categoryName: a.categoryName,
                        itemName: a.itemName,
                        count: a.count,
                        price: a.price
                    }
                })
            })
        } catch (error) {
            setError('You can have only one active delivery!')
        }
    };

    
    return (
        <Modal
            size="lg"
            show={show}
            onHide={handleClose}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <Modal.Title style={{ color: "black" }}>Delivery</Modal.Title>
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmitHandler}>
                <ModalBody>
                    <Container style={{ color: 'black' }}>
                        <Row>
                            <SendDeliveryItems items={deliveryItems[page]} />
                        </Row>
                        <Row>
                            <Pagination items={deliveryItems} page={page} setPage={setPage} />
                        </Row>

                        <Row className="mb-3">
                            <h4>Delivery address details</h4>
                        </Row>

                        {error != null ? (
                            <Row style={{ textAlign: 'center' }}>
                                <Alert variant="danger" style={{ width: '100%' }}>{error}</Alert>
                            </Row>
                        ) : null}

                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                            <Form.Label column sm="2">
                                Address:
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Enter address for delivery"
                                    value={address}
                                    name="address"
                                    onChange={onChangeHandler} />
                            </Col>
                        </Form.Group>
                    </Container>
                </ModalBody>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('closeButton')}
                    </Button>
                    <Button type="submit">Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};