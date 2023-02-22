import { faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Container, Dropdown, OverlayTrigger, Row, Table, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export default function ItemsView({ items }) {
    const { t } = useTranslation();
    const [hovered, setHover] = useState({});

    return (<>{items.map(a => (<Container key={items.indexOf(a)}>
        <Row>
            <div className='delivery-item'
                onMouseEnter={() => setHover({ categoryPosition: a.categoryPosition, itemPosition: a.itemPosition })}
                onMouseLeave={() => setHover({})}>

                <img src="/imgs/blog-1.jpg" width='30%' style={{
                    borderRadius: '40px/50px'
                }} alt='img' />
                <div style={{
                    paddingLeft: '15px',
                    width: '70%',
                    fontSize: 'small'
                }}>
                    <div>{a.categoryName}</div>
                    <div>{a.itemName}</div>
                    <div>{a.price.toFixed(2)} BGN <span style={{ textAlign: 'center', opacity: 0.6, paddingLeft: 5 }}>
                        {a.categoryPosition === hovered.categoryPosition && a.itemPosition === hovered.itemPosition ?
                            (<>
                                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red' }} />
                            </>)
                            : null}
                    </span></div>
                </div>
            </div>
        </Row>
        <Dropdown.Divider />
    </Container>
    ))}</>
    )

}

export function SendDeliveryItems({ items }) {
    const { t } = useTranslation();
    return (
        <Table>
            <thead>
                <tr>
                    <th style={{ borderTop: 'none' }}>Category Name</th>
                    <th style={{ borderTop: 'none' }}>Item Name</th>
                    <th style={{ borderTop: 'none' }}>Items Count</th>
                    <th style={{ borderTop: 'none' }}>Single Price</th>
                    <th style={{ borderTop: 'none' }}>Total Price</th>
                    <th style={{ borderTop: 'none' }}>Action</th>
                </tr>
            </thead>
            <tbody>
                {items.map(a => (
                    <tr key={a.itemPosition}>
                        <td>{a.categoryName}</td>
                        <td>{a.itemName}</td>
                        <td>{a.count}</td>
                        <td>{a.price.toFixed(2)}</td>
                        <td>{a.total.toFixed(2)}</td>
                        <td>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Add one
                                    </Tooltip>
                                }>
                                <button
                                    style={{ background: 'none', border: 'none' }}
                                    onClick={() => console.log('catched delete')} >

                                    <svg
                                        style={{ marginRight: 15 }}
                                        width="20"
                                        height="20"
                                        fill="green"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="bi bi-plus-circle"
                                        viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                    </svg>
                                </button>

                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Remove one
                                    </Tooltip>
                                }>
                                <button
                                    style={{ background: 'none', border: 'none' }}
                                    onClick={() => console.log('catched delete')}
                                >
                                    <svg
                                        style={{ marginRight: 15 }}
                                        width="20"
                                        height="20"
                                        fill="darkorange"
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="bi bi-dash-circle"
                                        viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                                    </svg>
                                </button>

                            </OverlayTrigger>
                            <OverlayTrigger
                                placement='top'
                                overlay={
                                    <Tooltip id={`tooltip-top`}>
                                        Delete all
                                    </Tooltip>
                                }>
                                <button
                                    style={{ background: 'none', border: 'none' }}
                                    onClick={() => console.log('catched delete')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg"
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
                    </tr>))}
            </tbody>
        </Table>
    )
}