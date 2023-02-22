import { useContext, useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { get } from "../../../Connection";
import { FavoritesContext } from "../../../Contexts";
import Pagination from "../../fragments/Pagination";
import Loading from "../../fragments/Loading";
import ItemsView from "./ItemsView";

export default function Favorites() {
    const [favorites, setFavorites] = useState();

    const favoritesContext = useContext(FavoritesContext);

    useEffect(() => {
        if (favoritesContext.items.length === 0) {
            setFavorites([]);
            return;
        }
        (async () => {
            const result = await Promise.all(favoritesContext.items.map(
                async (i) => {
                    const tempItem = await get('/items/category/' + i.categoryPosition + '/item/' + i.itemPosition);
                    tempItem.count = i.count;
                    tempItem.total = tempItem.price * i.count;
                    return tempItem;
                }));

            setFavorites(result);

        })()
    }, [favoritesContext]);

    if (favorites === undefined) {
        return <Loading />
    }

    function NotEmptyView() {
        return (<Container>
            <Row style={{ overflow: 'auto', maxHeight: '300px' }}>
                <ItemsView items={favorites} setFavorites={setFavorites} />
            </Row>
        </Container>
        )
    }

    return (<div>
        {favorites.length > 0 ? <NotEmptyView /> : (<>
            We dont have added favorites, yet!
        </>)}
    </div>
    )
}