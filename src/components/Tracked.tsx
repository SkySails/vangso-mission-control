import {
  Cartesian3,
  VelocityOrientationProperty,
  Transforms,
  ConstantProperty,
  HeadingPitchRoll,
  Math,
  Matrix4,
  Matrix3,
  Quaternion,
} from "cesium";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Entity } from "resium";
import useInterval from "../lib/hooks/useInterval";
import { getPositionReports } from "../lib/ogn";

export default function Tracked() {
  // const origin = Cartesian3.fromDegrees(13.32477, 58.312519, 1089);

  const [position, setPosition] = useState([
    [13.32477, 58.312519, 1089, "00:00:00"],
    [13.32477, 58.312519, 1089, "00:00:00"],
  ]);

  const [orientation, setOrientation] = useState<any>(undefined!);

  const cartesianPosition = Cartesian3.fromDegrees(
    position[0][0] as number,
    position[0][1] as number,
    position[0][2] as number
  );

  useInterval(() => {
    getPositionReports().then((data) => {
      console.log(data);
      const ac = data.find((ac) => ac.cn === "POL");
      const { lon, lat, alt, track, timestamp } = ac as OGNReport;
      console.log(ac);

      // const posProp = new SampledPositionProperty();

      const h = Math.toRadians(track - 90);
      const p = 0;
      const r = 0;

      const hpr = new HeadingPitchRoll(h, p, r);

      const or = Transforms.headingPitchRollQuaternion(
        Cartesian3.fromDegrees(lon, lat, alt),
        hpr
      );

      // const date = DateTime.fromFormat(timestamp, "TT").toISO();

      // const pos1 = Cartesian3.fromDegrees(
      //   position[0][0] as number,
      //   position[0][1] as number,
      //   position[0][2] as number
      // );
      // const date1 = DateTime.fromFormat(position[0][3] as string, "TT").toISO();

      // posProp.addSample(JulianDate.fromIso8601(date), pos);
      // posProp.addSample(JulianDate.fromIso8601(date1), pos1);

      setOrientation(or);
      setPosition([[lon, lat, alt, timestamp], position[0]]);
    });
  }, 5000);

  useEffect(() => {
    console.log("Orientation", orientation);
    console.log("Pos", position);
  }, [orientation, position]);

  return (
    <Entity
      model={{ uri: "assets/arcus.glb" }}
      position={cartesianPosition}
      orientation={orientation}
      tracked
    />
  );
}
