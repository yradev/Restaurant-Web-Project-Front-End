import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { get } from "../../Connection";
import Loading from "../Loading";

export default function Categories() {
    const [categories, setCategories] = useState();
    const { t } = useTranslation();

    useEffect(() => {
        try {
            (async () => {
                const result = await get('/categories');
                const categoriesSplitBy3 = []

                for (let index = 0; index < result.length; index += 3) {
                    const currentCategories = result
                        .filter(a => a.position > index)
                        .slice(0, 3);

                    categoriesSplitBy3.push(currentCategories);
                }

                setCategories(categoriesSplitBy3);
            })()
        } catch (error) {
        }
    }, [t]);

    if (categories === undefined) {
        return <Loading />
    }


    return (<>
        {categories.length !== 0 ? categories.map(a => (

            <div
                className="row"
                key={categories.indexOf(a)} style={{ marginBottom: 30 }}
            >

                {a.map(category => (
                    <div
                        className="col-md-4"
                        key={category.name}
                    >

                        <div className="card bg-transparent border my-3 my-md-0">
                            <img
                                src="/imgs/blog-1.jpg"
                                alt="template by DevCRID http://www.devcrud.com/"
                                className="rounded-0 card-img-top mg-responsive"
                            />
                            <div className="card-body">
                                <h3
                                    className="pt20 pb20"
                                    style={{ fontWeight: 'bold' }}
                                >
                                    {category.name}
                                </h3>

                                <p className="text-white">
                                    {category.description}
                                </p>

                                <Link
                                    className="btn btn-primary"
                                    style={{ fontSize: 'medium', fontWeight: 'bold' }}
                                    to={'/menu/' + category.position}
                                >
                                    {t('OpenMenuButton')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>)) : (

            <p
                style={{ padding: '10% 0' }}
                className='menu-edit-header'>
                {t('MenusEmpty')}
            </p>

        )}
    </>
    )
}