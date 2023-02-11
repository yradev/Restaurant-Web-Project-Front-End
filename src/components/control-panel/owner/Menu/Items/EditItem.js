import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { put } from "../../../../../Connection";

export function EditItem({ data, isModalOpen, newUpdate }) {
    const [show, setShow] = useState(true);
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [name, setName] = useState(data.name);
    const [position, setPosition] = useState(data.position);
    const [description, setDescription] = useState(data.description);
    const [price, setPrice] = useState(data.price);


    const itemPosition = data.position;

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await put('/items/edit/category/'+ data.categoryPosition + '/item/' + itemPosition, { position, name, description, price })
            newUpdate(true);
            handleClose();
        } catch (error) {
            setError(t('ItemConflict'))
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'position': setPosition(value); break;
            case 'description': setDescription(value); break;
            case 'price': setPrice(value); break;
            default: throw new Error();
        }

        setError(null);
    }
    function handleClose() {
        setShow(false);
        isModalOpen(false);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>{t('EditMenuHeader')}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "black" }}>{t('positionLabel')}</Form.Label>
                        <Form.Control
                            type="number"
                            name="position"
                            required
                            min='1'
                            max={data.total}
                            value={position}
                            onChange={onChangeHandler}
                            placeholder={t('productPositionPlaceholder')} />
                        <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{error}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "black" }}>{t('nameLabel')}</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            minLength='3'
                            maxLength='20'
                            value={name}
                            onChange={onChangeHandler}
                            placeholder={t('addProductNamePlaceholder')}
                            isInvalid={error != null} />
                        <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{error}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Label style={{ color: "black" }}>{t('descriptionLabel')}</Form.Label>
                        <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="description"
                        required
                        minLength='1'
                        maxLength='30'
                        value={description}
                        onChange={onChangeHandler}
                        placeholder={t('addProductDescriptionPlaceholder')} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "black" }}>{t('priceLabel')}</Form.Label>
                        <Form.Control
                            type="number"
                            name="price"
                            min="1"
                            step="0.01"
                            required
                            value={price}
                            onChange={onChangeHandler}
                            placeholder={t('addProductPricePlaceholder')} />
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('closeButton')}
                    </Button>

                    <Button variant="primary" type="submit">
                        {t('submitButton')}
                    </Button>
                </Modal.Footer>
            </Form >
        </Modal >
    );
}