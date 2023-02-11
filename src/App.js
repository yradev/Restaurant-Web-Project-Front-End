import Navigation from './components/navigation/Navigation';
import Router from './components/Router';
import i18next from 'i18next';
import React, { useEffect, useState } from 'react';
import { getFavoriteITems, getItemsFromDeliveryBag, getLanguage } from './Storage';
import { get } from './Connection';
import { DeliveryBagContext, FavoritesContext } from './Contexts';

function App() {
  const [language, setLanguage] = useState(getLanguage());
  const [coreSettings, setCoreSettings] = useState();
  const [favorites, setFavorites] = useState({
    items: getFavoriteITems()==null?[]: getFavoriteITems(),
    update() {
      const tempItems = {...favorites};
      tempItems.items = getFavoriteITems();
      setFavorites(tempItems);
    }
  });

  const [deliveryBag, setDeliveryBag] = useState({
    items: getItemsFromDeliveryBag()==null?[]: getItemsFromDeliveryBag(),
    update() {
      const tempItems = {...deliveryBag};
      const itemsFromStorage = getItemsFromDeliveryBag();
      tempItems.items = itemsFromStorage==null? [] : itemsFromStorage;
      setDeliveryBag(tempItems);
    }
  });

  useEffect(() => {
    (async () => {
      const role = await get('/core');
      setCoreSettings(role);
    })();
  }, []);

  

  const languages = [
    {
      code: "bg",
      name: "Bulgarian",
      flag: "bg"
    },
    {
      code: "en",
      name: "English",
      flag: "gb"
    }
  ];


  return (
    <div data-spy="scroll" data-target=".navbar" data-offset="40" >
      <FavoritesContext.Provider value={favorites}>
        <DeliveryBagContext.Provider value={deliveryBag}>
        <nav className="custom-navbar navbar navbar-expand-lg navbar-dark fixed-top" data-spy="affix" data-offset-top="10">
          <div className="dropdown d-inline-block" style={{ position: 'absolute', top: 0, left: 0, marginLeft: -6, marginTop: -6 }}>
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" style={{ border: 0 }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="lime" className="bi bi-translate" viewBox="0 0 16 16">
                <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z" />
                <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z" />
              </svg>     </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              {languages.map(({ code, name, flag }) => {
                if (code !== language) {
                  return (<button key={flag} className="dropdown-item" onClick={() => {
                    i18next.changeLanguage((code))
                    setLanguage(code)
                  }}>
                    <span className={`flag-icon flag-icon-${flag} mx-2`}></span> {name}</button>);
                }
                return null;
              })}
            </div>
          </div>

          <Navigation />
        </nav>
        {/* CONTENT */}
        <main>
          <div className='overlay'>
            <Router />
          </div>
        </main>

        {/* END CONTENT */}
        </DeliveryBagContext.Provider>
      </FavoritesContext.Provider>
      <footer>
        <div className="bg-dark text-light text-center border-top wow fadeIn">
          <p className="mb-0 py-3 text-muted small">
            {coreSettings !== undefined ? coreSettings.firmName : null}  &copy; Copyright <script>document.write(new Date().getFullYear())</script> Template is made by <a href="http://devcrud.com">DevCRUD</a></p>
        </div>
      </footer>
    </div >

  );
}

export default App;
