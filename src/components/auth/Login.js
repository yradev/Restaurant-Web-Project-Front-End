import React, { Suspense, useEffect, useState } from 'react';
import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';
import { login } from '../../Auth';
import { AuthenticationContext } from '../../Contexts';
import { checkRememberMe, cleanRememberMeData, getRememberedLoginData, rememberMe } from '../../Storage';


export const Login = ({setLogin, notification }) => {
  const [show, setShow] = useState(true);
  const [error, setError] = useState({});
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const auth = useContext(AuthenticationContext);

  useEffect(() => {
    const data = getRememberedLoginData();
    if (data !== null) {
      const cryptoJS = require("crypto-js");
      setEmail(data.email);
      setPassword(cryptoJS.AES.decrypt(data.password, 'm//32le./wmk2ee3`1m,ek2;wo22../2wm').toString(cryptoJS.enc.Utf8));
    }
  }, []);

  const { t } = useTranslation();

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await login(email, password);

    if (result !== undefined) {
      if (result === '403') {
        setError({ field: "password", error: t('wrongPasswordError') });
      } else if (result === '404') {
        setError({ field: "email", error: t('notFoundEmailError') });
      }
    } else {
      if (event.target.rememberMe.checked) {
        rememberMe(email, password);
      } else {
        cleanRememberMeData();
      }

      auth.changeLogin(true);
      handleClose();
    }
  };

  function onChangeHandler(event) {
    const name = event.target.name;
    const value = event.target.value;

    switch (name) {
      case 'email' : setEmail(value); break;
      case "password": setPassword(value); break;
      default: throw new Error();
    }
  }

  function handleClose() {
    setShow(false);
    setLogin(false);
  }

  return (
    <Suspense>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>{t('loginHeader')}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {notification !== undefined ? 
            (<div className="alert alert-success alert-dismissible fade show" style={{ textAlign: 'center' }} role="alert">
              {notification}
            </div>) : (null)}

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: "black" }}>{t('emailAddressLabel')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                required
                value={email == null ? '' : email}
                onChange={onChangeHandler}
                placeholder={t('emailAddressPlaceholder')}
                isInvalid={error.field === "email"} />
              <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }}>{error.error}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ color: "black" }}>{t('passwordLabel')}</Form.Label>
              <Form.Control type="password"
                required
                value={password == null ? '' : password}
                name="password"
                onChange={onChangeHandler}
                placeholder={t('passwordPlaceholder')}
                isInvalid={error.field === "password"} />
              <Form.Control.Feedback type='invalid' style={{ fontWeight: 600 }} >{error.error}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check style={{ color: "black" }}
                type="checkbox"
                name="rememberMe"
                defaultChecked={checkRememberMe()}
                label={t('rememberMeLabel')} />
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

export default Login;