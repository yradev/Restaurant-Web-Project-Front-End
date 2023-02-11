import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { get } from "../../../Connection";
import { AuthenticationContext, DeliveryBagContext } from "../../../Contexts";
import Login from "../../auth/Login";
import Pagination from "../../fragments/Pagination";
import Loading from "../../Loading";

export default function DeliveryBag() {
    const [items, setItems] = useState();
    const [itemsPage, setItemsPage] = useState(0);
    const [isLoginOpened, setIsLoginOpened] = useState(false);

    const deliveryBagContext = useContext(DeliveryBagContext);
    const authentication = useContext(AuthenticationContext);

    useEffect(() => {
        if (deliveryBagContext.items.length === 0) {
            setItems([]);
            return;
        }
        (async () => {
            const result = await Promise.all(deliveryBagContext.items.map(
                async (i) => {
                    const tempItem = await get('/items/category/' + i.categoryPosition + '/item/' + i.itemPosition);
                    tempItem.count = i.count;
                    tempItem.total = tempItem.price * i.count;
                    return tempItem;
                }));

            const itemsSplitBy3 = []

            for (let index = 0; index <= result.length; index += 5) {
                const currentItem = result
                    .filter(a => result.indexOf(a) >= index)
                    .slice(0, 5);
                itemsSplitBy3.push(currentItem);
            };

            setItems(itemsSplitBy3);

        })()
    }, [deliveryBagContext]);

    if (items === undefined) {
        return <Loading />
    }

    function addDeliveryHandler() {
        if (!authentication.isLogged) {
            setIsLoginOpened(true);
        }
    }
    
    function NotEmptyView() {
        return (<>
            <Container>
                <Row>
                    <Col>
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
                                {items[itemsPage].map(a => (
                                    <tr key={a.itemPosition}>
                                        <td>{a.categoryName}</td>
                                        <td>{a.itemName}</td>
                                        <td>{a.count}</td>
                                        <td>{a.price.toFixed(2)}</td>
                                        <td>{a.total.toFixed(2)}</td>
                                        <td>A</td>
                                    </tr>))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Pagination items={items} page={itemsPage} setPage={setItemsPage} />
                    </Col>
                    <Col>
                        <Button onClick={addDeliveryHandler}>Continue delivery</Button>
                    </Col>
                </Row>
                {isLoginOpened ? (<Login setLogin={setIsLoginOpened} notification={'You need to Login to continue!'}/>) : null}
            </Container>
        </>)
    }

    return (<>
        <div
            className="dropdown-menu"
            aria-labelledby="dropdownFavorites"
            style={{ paddingLeft: 0, color: 'black', left: '-100%' }}>
            {items.length > 0 ? <NotEmptyView /> : (<>
                We dont have added deliveries in bag, yet!
            </>)}
        </div>
    </>)
}