import { createContext, useContext, useState } from "react";
import { omit } from "../lib/commonUtil";
import GliderTrackerClient from "../lib/glidertracker/client";
const client = new GliderTrackerClient({ WebSocket });

export type Aircraft = Report & Call;

type AircraftList = {
  [id: string]: Aircraft;
};

export interface AircraftContextType {
  aircraft: AircraftList;
  setAircraftWithId: (id: string, report: any) => void;
  client: GliderTrackerClient;
  trackedAircraft: Aircraft["id"] | undefined;
  setTrackedAircraft: (id: Aircraft["id"]) => void;
}

export const AircraftContext = createContext<AircraftContextType>(undefined!);

function connect() {
  client.connect().then(() => {
    client.setView([4.020996, 55.646599, 24.927979, 61.41775]);

    console.log("Connection established.");

    // client.getOverview([13.29071, 58.645511, 18.517456, 60.057987]); // Get current situation
    // client.requestTrack("06DDDAC1", 1618745182238, Date.now()); // Get track of aircraft
  });
}

connect();

client.onClose = function () {
  console.log("Connection closed. Trying again!");
  connect();
};

export default function AircraftProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [aircraft, setAircraft] = useState<AircraftList>(() => {
    try {
      const item = localStorage.getItem("aircraft");
      return item ? JSON.parse(item) : {};
    } catch (e) {
      return {};
    }
  });
  const [trackedAircraft, setTrackedAircraft] = useState<
    Aircraft["id"] | undefined
  >(undefined);

  const setAircraftWithId = (id: string, report: any) => {
    setAircraft({
      ...aircraft,
      [id]: {
        ...aircraft[id],
        ...report,
      },
    });
  };

  client.onReport = async (report) => {
    if (!aircraft[report.id]) {
      // Aircraft not registered, send CALL req on websocket to get information
      console.info(
        "Missing data for aircraft with id:" + report.id + ". Sending lookup!"
      );
      client.lookupGlider(report.id, report.call);
    } else {
      setAircraftWithId(report.id, omit(report, ["call"]));
    }
  };

  client.onCall = (data) => {
    const { id, call, cn, type } = data;
    setAircraftWithId(id, data);
    localStorage.setItem(
      "aircraft",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("aircraft") || "{}"),
        [id]: {
          id,
          call,
          cn,
          type,
        },
      })
    );
  };

  return (
    <AircraftContext.Provider
      value={{
        setAircraftWithId,
        aircraft,
        client,
        trackedAircraft,
        setTrackedAircraft,
      }}
    >
      {children}
    </AircraftContext.Provider>
  );
}

export function useAircrafts(): AircraftContextType {
  return useContext(AircraftContext);
}
