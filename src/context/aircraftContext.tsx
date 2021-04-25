import { createContext, useContext, useState } from "react";
import GliderTrackerClient, { Call, Report } from "../lib/glidertracker/client";
const client = new GliderTrackerClient({ WebSocket });

export type Aircraft = Report & Call;

type AircraftList = {
  [id: string]: Aircraft;
};

export interface AircraftContextType {
  aircraft: AircraftList;
  setAircraftWithId: (id: string, report: any) => void;
  client: GliderTrackerClient;
}

export const AircraftContext = createContext<AircraftContextType>(undefined!);

function connect() {
  client.connect().then(() => {
    client.setView([14.898834, 59.130863, 17.512207, 59.834465]);

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

  const setAircraftWithId = (id: string, report: any) => {
    setAircraft({
      ...aircraft,
      [id]: {
        ...aircraft[id],
        ...report,
      },
    });
  };

  client.onReport = (report) => {
    if (!aircraft[report.id]) {
      // Aircraft not registered, send CALL req on websocket to get information
      console.info(
        "Missing data for aircraft with id:" + report.id + ". Sending lookup!"
      );
      client.lookupGlider(report.id, report.call);
    } else {
      setAircraftWithId(report.id, report);
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
      }}
    >
      {children}
    </AircraftContext.Provider>
  );
}

export function useAircrafts(): AircraftContextType {
  return useContext(AircraftContext);
}
