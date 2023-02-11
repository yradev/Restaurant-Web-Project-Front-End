import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { post } from "../../../../../Connection";

export default function AddCategory({isModalOpen, setCategoryAdded}) {
    const [show, setShow] = useState(true);
    const { t } = useTranslation();
    const [name, setName] = useState();
    const [description, setDescription] = useState();
    const [error, setError] = useState(null);


    async function handleSubmit(event) {
        event.preventDefault();
        try{
            await post('/categories/add',{name, description});
            setCategoryAdded(true);
            handleClose();
        }catch(error){
            setError(t('MenuConflict'))
        }
    }

    function onChangeHandler(event){
        const name = event.target.name;
        const value = event.target.value;

        switch(name){
            case'name': setName(value); break;
            case 'description': setDescription(value); break;
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
                <Modal.Title style={{ color: "black" }}>{t('addMenuHeader')}</Modal.Title>
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
                            value={name == null ? '' : name}
                            onChange={onChangeHandler}
                            placeholder={t('addMenuNamePlaceholder')}
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
                        placeholder='Enter item description' />
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