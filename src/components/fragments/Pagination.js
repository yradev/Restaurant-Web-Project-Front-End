import { Button } from "react-bootstrap";

export default function Pagination({items, page, setPage}) {
    const paginations = [];

    for (let i = 1; i <= items.length; i++) {
        paginations.push(i);
    }

    return (
        <nav aria-label="Page navigation example" style={{ position: `absolute`, bottom: '2%', left: '6%' }}>
            <ul className="pagination pagination-sm">

                <li className="page-item">
                    <Button className="page-link" style={page <= 0 ? { color: 'black' } : null}
                        onClick={page > 1 ? () => setPage(page - 1) : null}>
                        <i className="ti-angle-double-left"></i>
                    </Button>
                </li>

                {paginations.map(a => (
                    <li key={a} className={a - 1 === page ? "page-item active" : "page-item"}>
                        <button className="page-link" onClick={() => setPage(a)}>{a}</button>
                    </li>))}

                <li className="page-item">
                    <Button className="page-link" style={page >= items.length - 1 ? { color: 'black' } : null}
                        onClick={page < items.length - 1 ? () => setPage(page + 1) : null}>
                        <i className="ti-angle-double-right"></i>
                    </Button>
                </li>
            </ul>
        </nav>
    )
}