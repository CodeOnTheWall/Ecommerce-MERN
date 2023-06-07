// react 18
import React from "react";
import { createRoot } from "react-dom/client";
// react router
import { BrowserRouter, Routes, Route } from "react-router-dom";
// redux
// 'providing' all routes our redux store
import { Provider } from "react-redux";
import { store } from "./app/store";

import App from "./App";
import "./index.css";

// finding the element with id of root from index.html, calling it container
// creating a root with that container, then rendering jsx to that root
// hence all jsx will be rendered in that .root id in index.html
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* /* allows to have nested components */}
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
