import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ViewCategories } from "./Categories/CategoriesControl";
import { ItemsControl } from "./Items/ItemsControl";

export default function MenuControl() {
    const [categoryDetails, setCategoryDetails] = useState(null);
    const {t} = useTranslation();

    return (
        <header className="header wow fadeIn">
            <div className="overlay text-white text-left">
                <Container fluid="fluid" >
                    <Row>
                        <Col>
                            <Container fluid='fluid' style={{ backgroundColor: 'rgba(0, 0, 0, .30)', borderRadius: 25, width: '100%', height: '100%' }}>
                                <Row className="justify-content-center menu-edit-header">{t('MenusHeader')}</Row>
                                <Row className="justify-content-center menu-edit-text">
                                    <ViewCategories categoryDetails={setCategoryDetails} />
                                </Row>
                            </Container>
                        </Col>
                        <Col>
                            <Container fluid='fluid'
                                style={{ backgroundColor: 'rgba(0, 0, 0, .30)', borderRadius: 25, width: '100%', height: 450 }}>
                                <Row className="justify-content-center menu-edit-header">{categoryDetails==null?t('ItemsHeader'):categoryDetails.name}</Row>
                                <Row className="justify-content-center menu-edit-text">
                                    {categoryDetails == null ? (
                                        <p style={{ position: `absolute`, top: '50%' }}>{t('DontHavePickedMenu')}</p>
                                    ) :
                                        (<ItemsControl categoryPosition={categoryDetails.position} />)
                                    }
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        </header>
    );
}