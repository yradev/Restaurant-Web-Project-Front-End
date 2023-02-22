import { faCartPlus, faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useState } from "react";
import { Container, Dropdown, OverlayTrigger, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { FavoritesContext } from "../../../Contexts";
import { getFavoriteITems, removeFavoriteItem } from "../../../Storage";

export default function ItemsView({ items, setFavorites }) {
    const { t } = useTranslation();
    const [hovered, setHover] = useState({});
    const favorites = useContext(FavoritesContext);

    function deleteHandler(a){
        removeFavoriteItem(a.categoryPosition,a.itemPosition);
        favorites.update()
    }
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
                                <FontAwesomeIcon icon={faCartPlus} style={{ color: 'green',height: 13, paddingRight: 10 }} onClick={()=>console.log('wzaaaz')} />
                                <FontAwesomeIcon icon={faTrashCan} style={{ color: 'red',height: 13}} onClick={()=>deleteHandler(a)}/>
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