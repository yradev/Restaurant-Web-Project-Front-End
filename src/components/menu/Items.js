import { useContext } from "react";
import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { get } from "../../Connection";
import { DeliveryBagContext, FavoritesContext } from "../../Contexts";
import { addFavoriteItem, addItemToDeliveryBag, checkItemInFavorites, removeFavoriteItem } from "../../Storage";
import Loading from "../fragments/Loading";

export default function Items({ categoryPosition, categoryName }) {
    const [items, setItems] = useState();
    const [update, newUpdate] = useState();
    const favorites = useContext(FavoritesContext);
    const deliveryBag = useContext(DeliveryBagContext);

    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            setItems(undefined);

            const result = await get('/items/category/' + categoryPosition);

            categoryName(result.categoryName)

            const itemsSplitBy3 = []

            for (let index = 0; index <= result.items.length - 1; index += 3) {
                const currentItem = result.items
                    .filter(a => a.position > index)
                    .slice(0, 3);
                itemsSplitBy3.push(currentItem);
            };

            setItems(itemsSplitBy3);

        })();
    }, [categoryPosition, t, categoryName]);

    useEffect(() => {
        newUpdate(false);
    }, [update])

    if (items === undefined) {
        return <Loading />
    }

    function addToFavoritesHandler(categoryPosition, itemPosition) {
        addFavoriteItem(categoryPosition, itemPosition);
        newUpdate(true);
        favorites.update();
    }


    function removeFromFavoriteItemsHandler(categoryPosition, itemPosition) {
        removeFavoriteItem(categoryPosition, itemPosition);
        newUpdate(true);
        favorites.update();
    }

    function addToDeliveryBagHandler(categoryPosition, itemPosition) {
        addItemToDeliveryBag(categoryPosition, itemPosition)
        newUpdate(true);
        deliveryBag.update();
    }

    return (<>
        {items.length !== 0 ?

            items.map(a => {
                return (
                    <div
                        className="row"
                        key={items.indexOf(a)}
                        style={{ marginBottom: 30 }}
                    >

                        {a.map(item => (
                            <div
                                className="col-md-4"
                                key={item.name}
                            >

                                <div className="card bg-transparent border my-3 my-md-0">
                                    <div>
                                        <img
                                            src="/imgs/blog-1.jpg"
                                            alt="template by DevCRID http://www.devcrud.com/"
                                            className="rounded-0 card-img-top mg-responsive"
                                        />
                                    </div>

                                    <div className="card-body">
                                        <h2 className="text-center mb-4">
                                            <span className="badge badge-primary">
                                                {item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                {t('MenuItemsPriceCurrency')}
                                            </span>
                                        </h2>

                                        <h3 className="pt20 pb20"
                                            style={{ fontWeight: 'bold' }}>
                                            {item.name}

                                        </h3>

                                        <p className="text-white">
                                            {item.description}
                                        </p>


                                        <OverlayTrigger
                                            placement='top'
                                            overlay={
                                                <Tooltip id={`tooltip-top`}>
                                                    {checkItemInFavorites(item.position) ? t('removeFromFavoritesTolltip') : t('addToFavoritesTooltip')}
                                                </Tooltip>
                                            }>

                                            <Button
                                                onClick={() => {
                                                    if (!checkItemInFavorites(categoryPosition, item.position)) {
                                                        addToFavoritesHandler(categoryPosition, item.position)
                                                    } else {
                                                        removeFromFavoriteItemsHandler(categoryPosition, item.position);
                                                    }

                                                }}
                                                variant="btn btn-transperant"
                                                style={{ fontSize: 'large', fontWeight: 'bold', opacity: '0.7' }}                                >

                                                {checkItemInFavorites(categoryPosition, item.position) ?

                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="28"
                                                        height="28"
                                                        fill="darkRed"
                                                        className="bi bi-heart"
                                                        viewBox="0 0 16 16">
                                                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                                                    </svg>
                                                    :
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        width="26"
                                                        height="26"
                                                        fill="red"
                                                        className="bi bi-heart" viewBox="0 0 16 16">
                                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                                    </svg>
                                                }

                                            </Button>
                                        </OverlayTrigger>


                                        <OverlayTrigger
                                            placement='top'
                                            overlay={
                                                <Tooltip id={`tooltip-top`}>
                                                    {t('addToBagTooltip')}
                                                </Tooltip>
                                            }>
                                            <Button
                                                variant="btn btn-transperant"
                                                onClick={() => addToDeliveryBagHandler(categoryPosition, item.position)}>

                                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="green" className="bi bi-cart-plus" viewBox="0 0 16 16">
                                                    <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z" />
                                                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                                </svg>
                                            </Button>
                                        </OverlayTrigger>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>)
            }) : (

                <p
                    style={{ padding: '10% 0' }}
                    className='menu-edit-header'
                >
                    {t('MenuItemsEmpty')}
                </p>
            )}

        <Link
            className="btn btn-secondary"
            to='/menu'
            style={{ position: 'fixed', right: 4, bottom: '1%', opacity: .6 }}
        >

            <svg
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: 5 }}
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-box-arrow-left"
                viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
            </svg>

            {t('BackToMenus')}

        </Link>
    </>
    )
}