import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RecoilRoot } from "recoil";
import AppRouter from "./router";
import { StompProvider } from "./context/StompContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <RecoilRoot>
    <StompProvider>
      <AppRouter />
    </StompProvider>
  </RecoilRoot>
);
