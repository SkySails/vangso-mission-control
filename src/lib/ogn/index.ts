import { parseStringPromise } from "xml2js";

const gliderReportFormat = [
  "lat",
  "lon",
  "cn",
  "reg",
  "alt",
  "timestamp",
  "last_online",
  "track",
  "speed",
  "vario",
  "type",
  "reciever",
  "flight_id",
  "crc",
] as const;

type ReportKey = typeof gliderReportFormat[number];

const aircraftTypes = [
  "glider",
  "towplane",
  "helicopter",
  "parachute",
  "drop plane",
  "hang-glider",
  "para-glider",
  "powered aircraft",
  "jet aircraft",
];

export interface OGNResponse {
  markers: Markers;
}

export interface Markers {
  m: M[];
}

export interface M {
  $: {
    a: string;
  };
}

/**
 * Fetches aircraft positions from OGN via Glidernet AJAX API
 * @async
 * @example getPositionReports().then(data => console.log(data.speed))
 * @returns Promise<void>
 */
export async function getPositionReports(): Promise<OGNReport[]> {
  const response: OGNResponse = await fetch(
    "http://live.glidernet.org/lxml.php?a=0&b=60.597756&c=18.654785&d=57.759868&e=12.041016"
  )
    .then((res) => res.text())
    .then((xml) => parseStringPromise(xml))
    .then((json) => json as OGNResponse);

  const data: OGNReport[] = response.markers.m.map((ac) => {
    // Split marker string to get each part of report.
    // Ex. of string: "58.525799,13.500970,Z,SE-SMZ,1248,13:59:02,5768,31,76,-0.3,1,ESGR,4ACDBA,4f8e5560"
    const reportArr = ac["$"].a.split(",");

    // Match the resulting array with the known format using the indexes, translate type numbers into text
    // and evaluate non-string values to their real types.
    const report = gliderReportFormat.reduce(
      (report, name: ReportKey, i) => ({
        ...report,
        [name]:
          name === "type"
            ? aircraftTypes[+reportArr[i] - 1]
            : isNaN(+reportArr[i])
            ? reportArr[i]
            : +reportArr[i],
      }),
      {}
    ) as OGNReport;

    return report;
  });
  return data;
}

// For use at bboxfinder.com

// function bboxToSearchParams() {
//   const bbox = document.querySelector("#mapbounds")?.innerHTML.split(",").reverse()
//   return new URLSearchParams({
//     b: bbox[0],
//     c: bbox[1],
//     d: bbox[2],
//     e: bbox[3],
//   })
// }
