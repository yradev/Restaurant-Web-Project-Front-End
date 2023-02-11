import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { put } from "../../../../../Connection";

export function EditCategory({ data, isModalOpen, newUpdate }) {
    const [show, setShow] = useState(true);
    const { t } = useTranslation();
    const [dataError, setError] = useState({
        field: null,
        message: null,
        setNewError(field, message) {
            const tempError = { ...dataError };
            tempError.field = field;
            tempError.message = message;
            setError(tempError);
        },
        clean() {
            const tempError = { ...dataError };
            tempError.field = null;
            tempError.message = null;
            setError(tempError);
        }
    });
    const [name, setName] = useState(data.name);
    const [description, setDescription] = useState(data.description);
    const [position, setPosition] = useState(data.position);

    const categoryPosition = data.position;

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await put('/categories/edit/' + categoryPosition, { name, description, position })
            newUpdate(true);
            handleClose();
        } catch (error) {
            switch (error.message) {
                case '409': dataError.setNewError('name', t('MenuConflict')); break;
                case '400': dataError.setNewError('position', t('invalidPosition')); break;
                default: throw new Error();
            }
        }
    }

    function onChangeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;

        switch (name) {
            case 'name': setName(value); break;
            case 'description': setDescription(value); break;
            case 'position': setPosition(value); break;
            default: throw new Error();
        }

        dataError.clean();
    }
    function handleClose() {
        setShow(false);
        isModalOpen(false);
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title style={{ color: "black" }}>{t('editCategoryButton')}</Modal.Title>
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
                            maxLength='15'
                            value={name}
                            onChange={onChangeHandler}
                            placeholder={t('addMenuDescriptionPlaceholder')}
                            isInvalid={dataError.field === 'name'} />
                        <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{dataError.message}</Form.Control.Feedback>
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
                            placeholder={t('addMenuDescriptionPlaceholder')} />
                    </Form.Group>
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
                            placeholder={t('menuPositionPlaceholder')}
                            isInvalid={dataError.field === 'position'} />
                        <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{dataError.message}</Form.Control.Feedback>

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