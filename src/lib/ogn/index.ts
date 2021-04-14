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
    "http://live.glidernet.org/lxml.php?a=1&b=58.556076&c=57.849136&d=14.891968&e=12.278595"
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
