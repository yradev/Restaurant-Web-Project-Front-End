import { Suspense, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from "react-i18next";
import { post } from "../../Connection";

export default function Register({ setRegister, setLogin, setNotification }) {
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState({});
  const [confirmPassword, setConfirmPassword] = useState();

  const { t } = useTranslation();

  async function register(email, password) {
    try {
      await post("/auth/register", { email, password });
    } catch (error) {
      return error.message;
    }

  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      return;
    }

    const result = await register(email, password);
    if (result == null) {
      setRegister(false);
      setLogin(true);
      setNotification(t('userRegisteredAlert'));
    } else if (result === '409') {
      setError({ field: "email", message: t('conflictEmailError') });
    }

  }

  function onChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case "email":
        setEmail(value);
        if (error.field === "email") {
          error.field = null;
        }
        break;
      case "password": setPassword(value); break;
      case "confirmPassword": setConfirmPassword(value); break;
      default: throw new Error();
    }
  }

  function handleClose() {
    setShow(false);
    setRegister(false);
  }

  return (
    <Suspense>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>{t('registerHeader')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: "black" }}>{t('emailAddressLabel')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={onChangeHandler}
                placeholder={t('emailAddressPlaceholder')}
                isInvalid={error.field === "email"}
                required />
              <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{error.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: "black" }}>{t('passwordLabel')}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={onChangeHandler}
                placeholder={t('passwordPlaceholder')}
                minLength="5"
                required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: "black" }}>{t('confirmPasswordLabel')}</Form.Label>
              <Form.Control
                type="password"
                name='confirmPassword'
                placeholder={t('confirmPasswordPlaceholder')}
                onChange={onChangeHandler}
                isInvalid={confirmPassword !== password}
                required />
              <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{t('notEqualPasswords')}</Form.Control.Feedback>
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
    </Suspense>
  );
}