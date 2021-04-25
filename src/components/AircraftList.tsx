import React from "react";
import { useAircrafts } from "../context/aircraftContext";
import Aircraft from "./Aircraft";

export default function AircraftList() {
  const { aircraft } = useAircrafts();

  return (
    <>
      {Object.entries(aircraft).map(([id, data]) => (
        <Aircraft key={id} data={data} />
      ))}
    </>
  );
}