import { useTranslation } from "react-i18next"

export default function NotFound(){
    const { t } = useTranslation();
    return(
        <div className="fadeIn wow fadeIn">
            <header className="header">
                <div className="overlay text-white text-center">
                    <h2 className="display-4 mb-5">{t('notFoundPageErrorMessage')}</h2>
                </div>
            </header>
            </div>
    )
}