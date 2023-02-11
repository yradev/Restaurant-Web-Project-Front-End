import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { get } from "../../Connection";
import Loading from "../Loading";

export default function HomeComponent() {
    const { t } = useTranslation();
    const [coreData, setCoreData] = useState();

    useEffect(() => {
        (async () => {
            const data = await get('/core');
            setCoreData(data)
        })();
    }, [t])

    if (coreData === undefined) {
        return <Loading/>;
    }

    
    return (
            <div className="fadeIn wow fadeIn">
            <header className="header">
                <div className="overlay text-white text-center">
                    <h1 className="display-2 font-weight-bold my-3">{coreData !== undefined ? coreData.name : null}</h1>
                    <h2 className="display-4 mb-5">{coreData !== undefined ? coreData.description : null}</h2>
                    <Link className="btn btn-lg btn-primary" to="/menu">{t("viewOurMenuButton")}</Link>
                </div>
            </header>
            </div>
    )
};