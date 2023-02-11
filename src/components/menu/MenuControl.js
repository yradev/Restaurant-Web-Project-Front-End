import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Categories from "./Categories";
import Items from "./Items";

export default function MenuControl() {
    const { categoryPosition } = useParams();
    const [categoryName, setCategoryName] = useState(null);

    const { t } = useTranslation();

    return (
        <div
            className="container-fluid text-light py-5 text-center wow fadeIn"
            style={{ minHeight: 700 }}>

            <h2
                className="row section-title py-4 justify-content-center mt-4 menu-edit-header"
                style={{ fontSize: 'xxx-large' }}>

                {categoryName === null ? (<>{t('MenusHeader')}</>) : categoryName}

            </h2>

            <div
                className="tab-content"
                id="pills-tabContent" >

                <div
                    className="tab-pane fade show active"
                    id="foods"
                    role="tabpanel"
                    aria-labelledby="pills-home-tab">
                 
                    {categoryPosition !== undefined ?
                        (
                        <Items 
                            categoryPosition={categoryPosition} 
                            categoryName={setCategoryName}/>)
                        :
                        (<Categories />)}
                </div>
            </div>
        </div>
    )
}