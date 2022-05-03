import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AircraftProvider from "./context/aircraftContext";
import { Ion } from "cesium";

Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNzQ4ODIyNC1lMWRkLTQyNjktOTQwMS1hY2MzYjliMDRmNDUiLCJpZCI6NTIwMzgsImlhdCI6MTYxODQwNTAyNH0.kgVLR6n3y6l6BR4hzGbAka5tElPjyXiDWMC2IwPqbIk";

ReactDOM.render(
  <React.StrictMode>
    <AircraftProvider>
      <App />
    </AircraftProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
