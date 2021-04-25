import {
  Cartesian3,
  createWorldTerrain,
  IonResource,
  viewerCesiumInspectorMixin,
} from "cesium";
import React from "react";
import { CameraFlyTo, Cesium3DTileset, Viewer } from "resium";
import AircraftList from "./components/AircraftList";
import Statistics from "./components/Statistics";
import "./App.css";

const DEFAULT_LOCATION = Cartesian3.fromDegrees(13.32477, 58.312519, 6089);

const App = () => {
  return (
    <main style={{ display: "flex", height: "100vh" }}>
      <Statistics />
      <Viewer
        style={{ flex: 1 }}
        terrainProvider={createWorldTerrain()}
        extend={viewerCesiumInspectorMixin}
        animation={false}
        timeline={false}
      >
        <Cesium3DTileset url={IonResource.fromAssetId(96188)} />
        <CameraFlyTo duration={0} destination={DEFAULT_LOCATION} />
        <AircraftList />
      </Viewer>
    </main>
  );
};
export default App;
