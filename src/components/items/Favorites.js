import { useContext, useEffect } from "react";
import { useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { get } from "../../Connection";
import { FavoritesContext } from "../../Contexts";
import Pagination from "../fragments/Pagination";
import Loading from "../Loading";

export default function Favorites() {
    const [favorites, setFavorites] = useState();
    const [favoritesPage, setFavoritesPage] = useState(0);

    const favoritesContext = useContext(FavoritesContext);

    useEffect(() => {
        (async () => {
            const result = await Promise.all(favoritesContext.items.map(
                async (i) => {
                    return get('/items/category/' + i.categoryPosition + '/item/' + i.itemPosition)
                }));

            const itemsSplitBy3 = []

            for (let index = 0; index <= result.length; index += 5) {
                const currentItem = result
                    .filter(a => result.indexOf(a) >= index)
                    .slice(0, 5);
                itemsSplitBy3.push(currentItem);
            };

            setFavorites(itemsSplitBy3);

        })()
    }, [favoritesContext]);

    if (favorites === undefined) {
        return <Loading />
    }

    function NotEmptyView(){
        return (<>
                <Container>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ borderTop: 'none' }}>CategoryName</th>
                                        <th style={{ borderTop: 'none' }}>ItemName</th>
                                        <th style={{ borderTop: 'none' }}>Price</th>
                                        <th style={{ borderTop: 'none' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {favorites[favoritesPage].map(a => (
                                        <tr key={a.itemPosition}>
                                            <td>{a.categoryName}</td>
                                            <td>{a.itemName}</td>
                                            <td>{a.price}</td>
                                            <td>A</td>
                                        </tr>))}
                                </tbody>
                            </Table>
                        </Col>
                        <Pagination items={favorites} page={favoritesPage} setPage={setFavoritesPage} />
                    </Row>
                </Container>
        </>)    
    }

    return (<>
        <div
            className="dropdown-menu"
            aria-labelledby="dropdownFavorites"
            style={{ paddingLeft: 0, color: 'black' }}>

                {favorites.length!=null?<NotEmptyView />:null}

        </div>
    </>)
}