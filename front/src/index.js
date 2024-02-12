import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import global_es from "./translations/es/global.json";
import global_en from "./translations/en/global.json";
i18next.init({
  interpolation: { escapeValue: false },
  lng: navigator.language.substr(0, 2) === "es" ? "es" : "en",
  resources: {
    es: {
      global: global_es,
    },
    en: {
      global: global_en,
    },
  },
});
ReactDOM.render(
  <Auth0Provider
    domain="dev-m9erqtpp.us.auth0.com"
    clientId="et4uk6mjxWuSgk6bSI954vwq5AotZlXA"
    redirectUri={window.location.origin}
  >
    <React.StrictMode>
      <BrowserRouter>
        <I18nextProvider i18n={i18next}>
          <Provider store={store}>
            <App />
          </Provider>
        </I18nextProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
