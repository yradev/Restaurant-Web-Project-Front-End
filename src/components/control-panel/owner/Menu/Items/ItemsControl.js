import { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap";
import { confirmAlert } from "react-confirm-alert";
import { useTranslation } from "react-i18next";
import { del, get } from "../../../../../Connection";
import AddItem from "./AddItem";
import { EditItem } from "./EditItem";

export function ItemsControl({ categoryPosition }) {
    const [items, setItems] = useState();
    const [update, setUpdate] = useState(false);
    const [itemPage, setItemPage] = useState(1);
    const { t } = useTranslation();

    const [modalControl, setModalControl] = useState({
        isModalAddItemOpen: false,
        isModalEditItemOpen: false,
        changeAddItemModalStatus(value) {
            const modal = { ...modalControl }
            modal.isModalAddItemOpen = value;
            setModalControl(modal);
        },
        changeEditItemModalStatus(value, data) {
            if (!modalControl.isModalEditItemOpen) {
                const modal = { ...modalControl }
                modal.isModalEditItemOpen = value;
                modal.pickedItemData = data;
                setModalControl(modal);
            } else {
                const modal = { ...modalControl }
                modal.isModalEditItemOpen = value;
                delete modal.pickedItemData;
                setModalControl(modal);
            }
        }
    });



    useEffect(() => {
        (async () => {
            const tempItems = await get('/items/category/' + categoryPosition + '/page/' + itemPage);
            setItems(tempItems);
            setUpdate(false);
        })();

    }, [update, itemPage, categoryPosition, t]);

    if (items === undefined) {
        return <Spinner />;
    }

    const deleteHandler = (position) => {
        const options = {
            title: t('DeleteHeader'),
            message: t('DeleteConfirmItem'),
            buttons: [
                {
                    label: t('YesButton'),
                    onClick: async () => {
                        try {
                            await del('/items/delete/category/' + categoryPosition + '/item/' + position);
                            setUpdate(true);
                        } catch (err) {

                        }
                    }
                },
                {
                    label: t('NoButton'),
                }
            ],
            closeOnEscape: true,
            closeOnClickOutside: true,
            keyCodeForClose: [8, 32],
            willUnmount: () => { },
            afterClose: () => { },
            onClickOutside: () => { },
            onKeypress: () => { },
            onKeypressEscape: () => { },
            overlayClassName: "overlay-custom-class-name"
        };

        confirmAlert(options);
    };

    function View() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Table responsive="sm">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{t('nameTable')}</th>
                                    <th>{t('descriptionTable')}</th>
                                    <th>{t('priceTable')}</th>
                                    <th>{t('actionTable')}</th>
                                </tr>
                            </thead>
                            <tbody>

                                {items.items.map(a => {
                                    a.total = items.totalEntities;
                                    return (
                                        <tr key={a.name}>
                                            <td>{a.position}</td>
                                            <td>{a.name}</td>
                                            <td>
                                                <OverlayTrigger
                                                    placement='left'
                                                    overlay={
                                                        <Tooltip id={`tooltip-left`}>
                                                            {a.description}
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Button variant="outline-success" size="sm">
                                                        {t('viewDescriptionTable')}
                                                    </Button>
                                                </OverlayTrigger>
                                            </td>
                                            <td>{a.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} BGN</td>
                                            <td>
                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id={`tooltip-top`}>
                                                            {t('editTable')}
                                                        </Tooltip>
                                                    }>
                                                    <button style={{ background: 'none', border: 'none' }}
                                                        onClick={() => {
                                                            a.categoryPosition = categoryPosition;
                                                            modalControl.changeEditItemModalStatus(true, a);
                                                        }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                            width="20"
                                                            height="20"
                                                            fill="orange"
                                                            className="bi bi-pencil"
                                                            viewBox="0 0 16 16"
                                                            style={{ marginRight: 15 }}>
                                                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                                                        </svg>
                                                    </button>
                                                </OverlayTrigger>

                                                <OverlayTrigger
                                                    placement='top'
                                                    overlay={
                                                        <Tooltip id={`tooltip-top`}>
                                                            {t('DeleteHeader')}
                                                        </Tooltip>
                                                    }>
                                                    <button
                                                        style={{ background: 'none', border: 'none' }}
                                                        onClick={() => deleteHandler(a.position)}
                                                    ><svg xmlns="http://www.w3.org/2000/svg"
                                                        style={{ marginRight: 15 }}
                                                        width="20"
                                                        height="20"
                                                        fill="red"
                                                        className="bi bi-trash3"
                                                        viewBox="0 0 16 16">
                                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                                                        </svg></button>

                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Col>
                    {modalControl.isModalEditItemOpen ? (
                        <EditItem data={modalControl.pickedItemData} isModalOpen={modalControl.changeEditItemModalStatus} newUpdate={setUpdate} />
                    ) : null}
                </Row>
            </Container>
        );
    }


    function Pagination() {
        const paginations = [];

        for (let i = 1; i <= items.totalPages; i++) {
            paginations.push(i);
        }

        return (
            <nav aria-label="Page navigation example" style={{ position: `absolute`, bottom: '2%', left: '6%' }}>
                <ul className="pagination pagination-sm">

                    <li className="page-item">
                        <Button className="page-link" style={itemPage <= 1 ? { color: 'black' } : null}
                            onClick={itemPage > 1 ? () => setItemPage(itemPage - 1) : null}>
                            <i className="ti-angle-double-left"></i>
                        </Button>
                    </li>

                    {paginations.map(a => (
                        <li key={a} className={a === itemPage ? "page-item active" : "page-item"}>
                            <button className="page-link" onClick={() => setItemPage(a)}>{a}</button>
                        </li>))}

                    <li className="page-item">
                        <Button className="page-link" style={itemPage >= items.totalPages ? { color: 'black' } : null}
                            onClick={itemPage < items.totalPages ? () => setItemPage(itemPage + 1) : null}>
                            <i className="ti-angle-double-right"></i>
                        </Button>
                    </li>
                </ul>
            </nav>
        )
    }

    return (
        <>
            {items.length === 0 ? (
                <p style={{ position: `absolute`, top: '50%' }}>{t('ItemsEmpty')}</p>
            ) : (<>
                <View />
                <Pagination />
            </>
            )}

            <Button
                variant="success"
                style={{ position: 'absolute', bottom: '5%', right: '5%' }}
                onClick={() => modalControl.changeAddItemModalStatus(true)}
            >{t('addItemButton')}
            </Button>

            {modalControl.isModalAddItemOpen ? (<AddItem isModalOpen={modalControl.changeAddItemModalStatus} update={setUpdate} categoryPosition={categoryPosition} />) : null}
        </>
    );
}