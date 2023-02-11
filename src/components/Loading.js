import { Spinner } from "react-bootstrap";

export default function Loading() {
    return (
        <header className="header wow fadeIn">
                <div className="overlay text-white text-center">
                <Spinner />
            </div>
        </header>
    )
}