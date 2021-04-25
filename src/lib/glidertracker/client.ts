import { BBox } from "cheap-ruler";
import aprs from "aprs-parser";
import {
  isGlider,
  getGlider,
  isTrackUpdate,
  isLastSeen,
  isPing,
  isCallUpdate,
  getNewCall,
} from "../aprs/tools";

export interface GliderTrackerClientOptions {
  WebSocket: any;
}

interface AircraftListeners {
  [id: string]: (cb: any) => void;
}

export type Report = {
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

export type Call = {
  id: string;
  call: string;
  cn: string;
  type: string;
};

export default class GliderTrackerClient {
  onClose: (() => void) | undefined;
  onTrack: ((id: string, fixes: any[]) => void) | undefined;
  onReport: ((report: Report) => void) | undefined;
  onCall: ((call: Call) => void) | undefined;

  private ws: any;
  private readonly parser = new aprs.APRSParser();
  private readonly options: GliderTrackerClientOptions;
  private listeners: AircraftListeners = {};
  private queryCalls: string[] = [];

  constructor(options: GliderTrackerClientOptions) {
    this.options = options;
  }

  connect() {
    this.ws = new this.options.WebSocket("ws://glidertracker.de:3389/");

    this.ws.onclose = () => {
      this.ws = null;
      if (this.onClose) this.onClose();
    };

    this.ws.onmessage = (event: any) => {
      this.handleMessage(event.data);
    };

    return new Promise((resolve) => {
      this.ws.onopen = resolve;
    });
  }

  send(message: string) {
    if (this.ws) {
      this.ws.send(message);
    }
  }

  sendQueue() {
    if (this.queryCalls.length > 0) {
      const query = this.queryCalls.shift() as string;
      this.send(query);
      setTimeout(() => {
        this.sendQueue();
      }, 333);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  setView(bbox: BBox) {
    let [minX, minY, maxX, maxY] = bbox;
    this.send(`VIEW:${minX}|${minY}|${maxX}|${maxY}`);
  }

  getOverview(bbox: BBox) {
    let [minX, minY, maxX, maxY] = bbox;
    this.send(`OVERVIEW?0${minX}|${minY}|${maxX}|${maxY}`);
  }

  requestTrack(id: string, from: number, to: number) {
    this.send(
      `TRACK?${id}|${Math.round(from / 1000)}|${Math.round(to / 1000)}`
    );
  }

  addListenerForId(id: string, fn: (report: Report) => void) {
    this.listeners[id] = fn;
    return () => {
      delete this.listeners[id];
    };
  }

  lookupGlider(id: string, call: string) {
    this.send("CALL?" + id + "/" + call + "|");
  }

  private handleMessage(message: string) {
    if (isTrackUpdate(message) && this.onTrack) {
      let parts = message.split("|");
      let id = parts.shift()!.slice(6);
      let fixes = parts.filter(Boolean).map((str) => {
        let parts = str.split("/");
        let lat = parseFloat(parts[0]);
        let lon = parseFloat(parts[1]);
        let alt = parseFloat(parts[2]);
        let time = Date.parse(parts[3]);
        return { lat, lon, alt, time };
      });

      this.onTrack(id, fixes);
    } else if (isGlider(message)) {
      let report = getGlider(message);
      this.listeners[report.id] && this.listeners[report.id](report);
      this.onReport && this.onReport(report);
    } else if (isCallUpdate(message)) {
      const call = getNewCall(message);
      // console.info("Recieved call:", call);
      this.onCall && this.onCall(call);
    } else if (isLastSeen(message)) {
      // console.log(message);
    } else if (isPing(message)) {
      this.send("PONG!?!");
    }
  }
}
