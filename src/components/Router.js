import { Suspense } from "react";
import { Spinner } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import CoreSettings from "./control-panel/owner/CoreSettings";
import CoreMenuControl from "./control-panel/owner/Menu/MenuControl";
import UserControl from "./control-panel/owner/UserControl";
import HomeComponent from "./home/HomeComponent";
import NotFound from "./errors/NotFound";
import MenuControl from "./menu/MenuControl";
import { createContext } from "react";

export const favoritesContext = createContext();

function Router() {
    return (
        <Suspense fallback={<Spinner />}>
            <Routes>
                <Route path='/' exact element={<HomeComponent />} />
                <Route path='/settings/owner/core' exact element={<CoreSettings />} />
                <Route path='/settings/owner/user' exact element={<UserControl />} />
                <Route path='/settings/owner/menu' exact element={<CoreMenuControl />} />
                <Route path='/menu' exact element={<MenuControl />} />
                <Route path='/menu/:categoryPosition' exact element={<MenuControl />} />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Suspense>
    );
}

export default Router;