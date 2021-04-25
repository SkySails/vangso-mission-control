interface GliderTrackerClientOptions {
  WebSocket: any;
}

interface AircraftListeners {
  [id: string]: (cb: any) => void;
}

type Report = {
  call: string;
  climbrate: number;
  altitude: number;
  errors: number;
  heading: number;
  id: string;
  lat: number;
  lon: number;
  receiver: string;
  rotation: number;
  signal: number;
  source: number;
  speed: number;
  symbol: number;
  timestamp: number;
};

type Call = {
  id: string;
  call: string;
  cn: string;
  type: string;
};
