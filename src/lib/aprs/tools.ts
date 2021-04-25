import { DateTime } from "luxon";

export function isSrvState(message: string) {
  if (message.search("STATE:") !== -1) return true;
  else return false;
}
export function isCallUpdate(message: string) {
  if (message.search("CALL:") !== -1) return true;
  else return false;
}
export function isTrackUpdate(message: string) {
  if (message.search("TRACK:") !== -1) return true;
  else return false;
}
export function isRxUpdate(message: string) {
  if (message.search("RX:") !== -1) return true;
  else return false;
}
export function isLastSeen(message: string) {
  if (message.search("SEEN:") !== -1) return true;
  else return false;
}
export function isReloadPage(message: string) {
  if (message.search("RELOAD:") !== -1) return true;
  else return false;
}
export function isSearchResult(message: string) {
  if (message.search("SEARCH:") !== -1) return true;
  else return false;
}
export function isError(message: string) {
  if (message.search("ERROR:") !== -1) return true;
  else return false;
}
export function isChatMsg(message: string) {
  if (message.search("MESSAGE:") !== -1) return true;
  else return false;
}
export function isPing(message: string) {
  if (message.search("PING?!?") !== -1) return true;
  else return false;
}

export function isAPRS(message: string) {
  if (
    message.search(">OGFLR,qA") !== -1 ||
    message.search(">APRS,qA") !== -1 ||
    message.search(">APRS,TCPIP*") !== -1 ||
    message.search(">APRS,RELAY*") !== -1 ||
    message.search(">OGNFNT,qA") !== -1 ||
    message.search(">OGNTRK,qA") !== -1
  )
    return true;
  else return false;
}
export function isGlider(message: string) {
  if (
    (message.search(">OGFLR,qAS") !== -1 ||
      message.search(">APRS,qAS") !== -1 ||
      message.search(">APRS,RELAY*") !== -1 ||
      message.search(">OGNFNT,qAS") !== -1 ||
      message.search(">OGNTRK,qAS") !== -1) &&
    message.search(" id") !== -1
  )
    return true;
  else return false;
}
export function isRX(message: string) {
  if (message.search(">APRS,TCPIP") !== -1) return true;
  else return false;
}

export function getGlider(message: string) {
  let glider = {
    call: "",
    receiver: "",
    id: "",
    source: 0,
    symbol: 0,
    lat: 0.0,
    lon: 0.0,
    altitude: 0.0,
    heading: 0.0,
    speed: 0.0,
    climbrate: 0.0,
    rotation: 0,
    signal: 0.0,
    errors: 0,
    timestamp: 0,
  };
  // call
  let callResult = message.match(/([^>]+)/);
  if (callResult != null) {
    glider.call = callResult[1];
  }

  // Receiver
  let rxResult = message.match(/(?:,)([a-zA-Z0-9]+)(?::\/)/);
  if (rxResult != null) {
    glider.receiver = rxResult[1];
  }

  // id
  let idResult = message.match(/(?: id)([a-fA-f0-9]+)/);
  if (idResult != null) {
    glider.id = idResult[1];
  }

  // timestamp
  let tsResult = message.match(/(?:\/)(\d+)(?:h)/);
  if (tsResult != null) {
    glider.timestamp = DateTime.fromFormat(tsResult[1], "HHmmss").toMillis();
  }

  //try to decode additional accuracy
  let addLat = "0";
  let addLon = "0";
  let ltlonResult = message.match(/(?: !W)(\d)(\d)(?:!)/);
  if (ltlonResult != null) {
    addLat = ltlonResult[1];
    addLon = ltlonResult[2];
  }

  // lat
  let latResult = message.match(/(?:h)(\d+\.\d+)(?:[NS])/);
  if (latResult != null) {
    glider.lat = ddmm2deg(latResult[1] + addLat);
  }
  if (!isNorth(message)) {
    glider.lat *= -1;
  }

  // lon
  let lonResult = message.match(/(?:[NS].)(\d+\.\d+)(?:[EW])/);
  if (lonResult != null) {
    glider.lon = ddmm2deg(lonResult[1] + addLon);
  }
  if (!isEast(message)) {
    glider.lon *= -1;
  }

  // altitude
  let altResult = message.match(/(?:\/A=)(\d+)/);
  if (altResult != null) {
    glider.altitude = parseInt(altResult[1]) / 3.281;
  }

  // heading and speed
  let hsResult = message.match(/(\d+)(?:\/)(\d+)(?:\/)/);
  if (hsResult != null) {
    glider.heading = parseInt(hsResult[1]);
    glider.speed = parseInt(hsResult[2]);
  }

  // climbrate
  let vsResult = message.match(/(?: )([+-]\d+)(?:fpm)/);
  if (vsResult != null) {
    glider.climbrate = parseInt(vsResult[1]);
  }

  // rotation
  let rotResult = message.match(/(?: )([+-]\d+\.\d+)(?:rot)/);
  if (rotResult != null) {
    glider.rotation = parseFloat(rotResult[1]);
  }

  // signal strength
  let dbResult = message.match(/(?: )(\d+\.\d+)(?:dB)/);
  if (dbResult != null) {
    glider.signal = parseFloat(dbResult[1]);
  }

  // error
  let errResult = message.match(/(?: )(\d+)(?:e)/);
  if (errResult != null) {
    glider.errors = parseInt(errResult[1]);
  }

  /* symbol
  let result = message.match(/(?:\d+\.\d+[NS])(.)(?:\d+\.\d+[EW])(.)/);
  if(result != null){
    glider.symbol = result[1] + result[2];
  }*/

  // symbol
  glider.symbol = getSymbolFromId(glider.id);
  glider.source = getSourceFromId(glider.id);

  // frequency drift  (?: )([\+\-]\d+\.\d+)(?:kHz)

  // gps accuracy     (?: gps)(\d+x\d+)

  if (
    isNaN(glider.timestamp) ||
    isNaN(glider.lon) ||
    isNaN(glider.lat) ||
    isNaN(glider.altitude) ||
    isNaN(glider.heading) ||
    isNaN(glider.speed) ||
    isNaN(glider.climbrate) ||
    isNaN(glider.rotation)
  ) {
    //|| (glider.id=="0ADDB117") || (glider.id=="1D4B05CA") ){
    console.log(glider);
    console.log(message);
    console.log("-----------------------");
  }

  return glider;
}

export function getNewCall(message: string) {
  var newCall = { id: "", call: "", cn: "", type: "" };
  //CALL:0AB345/D-KTCJ|
  // user
  //var result = message.match(/(?:CALL\:)([a-fA-f0-9]+)(?:\/)([^\[]+)(?:\[)([0-9a-zA-Z]*)(?:\])([^|]*)/);
  var result = message.match(
    /(?:CALL:)([^/]+)(?:\/)([^[]+)(?:\[)([^\]]*)(?:\])([^|]*)/
  );
  if (result != null) {
    newCall.id = result[1];
    newCall.call = result[2];
    newCall.cn = result[3];
    newCall.type = result[4];
  }
  //console.log(newCall);
  return newCall;
}

function ddmm2deg(message: string) {
  var degree = Math.floor(parseInt(message) / 100);
  var minute = parseFloat(message) - degree * 100;
  return degree + minute / 60;
}

function isNorth(string: string) {
  var result = string.match(/(?::\/\d+[h]\d+[.]\d+)(.)/);
  if (result == null) return null;
  if (result[1] === "N") return true;
  else return false;
}

function isEast(string: string) {
  var result = string.match(/(?::\/\d+[h]\d+[.]\d+[NS].\d+[.]\d+)(.)/);
  if (result == null) return null;
  if (result[1] === "E") return true;
  else return false;
}

export function getSymbolFromId(id: string) {
  var flags = parseInt(id.substr(0, 2), 16);
  flags = (flags >> 2) & 0x0f;
  return flags;
}

export function getSourceFromId(id: string) {
  var flags = parseInt(id.substr(0, 2), 16);
  flags = flags & 0x03;
  return flags;
}
