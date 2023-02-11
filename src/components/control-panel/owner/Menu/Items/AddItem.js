import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { post } from "../../../../../Connection";

export default function AddItem({ isModalOpen, update, categoryPosition }) {
    const [show, setShow] = useState(true);
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState(null);


    async function handleSubmit(event) {
        event.preventDefault();

        try {
            await post('/items/add',{name,description,price, categoryPosition});
            update(true);
            handleClose();
        } catch (error) {
            console.log(error);
            setError(t('ItemConflict'))
        }

    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'price': setPrice(value); break;
            case 'description': setDescription(value); break;
            default: new Error();
        }

        if (error != null) {
            setError(null);
        }
    }

    function handleClose() {
        setShow(false);
        isModalOpen(false);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>{t('AddProductHeader')}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
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
                    <Form.Group>
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
            </Form>
        </Modal>
    );
}