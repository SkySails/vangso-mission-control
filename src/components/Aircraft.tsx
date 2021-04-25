import {
  Cartesian3,
  Color,
  ConstantProperty,
  HeadingPitchRoll,
  LabelGraphics,
  Math as CMath,
  Transforms,
} from "cesium";
import Cartesian2 from "cesium/Source/Core/Cartesian2";
import LabelStyle from "cesium/Source/Scene/LabelStyle";
import VerticalOrigin from "cesium/Source/Scene/VerticalOrigin";
// import { DateTime } from "luxon";
import React from "react";
import { Entity } from "resium";
import { Aircraft } from "../context/aircraftContext";

// function log(
//   time: string,
//   id: string,
//   lon: number,
//   lat: number,
//   alt: number,
//   speed?: number
// ) {
//   console.log(
//     time,
//     id,
//     lon.toFixed(6),
//     lat.toFixed(6),
//     speed ? Math.round(speed) + "km/h" : "??? km/h",
//     Math.round(alt) + "m"
//   );
// }

export default function Tracked({ data }: { data: Aircraft }) {
  let [lon, lat, alt, heading] = [
    data.lon,
    data.lat,
    data.altitude,
    data.heading,
  ];

  if (typeof lon !== "number") return null;

  const cartesianPosition = Cartesian3.fromDegrees(lon, lat, alt + 20);

  const h = CMath.toRadians(heading - 90);
  const p = 0;
  const r = 0;

  const hpr = new HeadingPitchRoll(h, p, r);

  const or = new ConstantProperty(
    Transforms.headingPitchRollQuaternion(
      Cartesian3.fromDegrees(lon, lat, alt),
      hpr
    )
  );

  return (
    <Entity
      model={{
        uri: "assets/arcus.glb",
        scale: 1,
        maximumScale: 110,
        minimumPixelSize: 300,
      }}
      position={cartesianPosition}
      orientation={or}
      label={
        new LabelGraphics({
          text: data.cn,
          pixelOffset: new Cartesian2(0, -50),
          // backgroundColor: new Color(0.173, 0.659, 0.961, 1),
          fillColor: new Color(0.173, 0.659, 0.961, 1),
          outlineColor: Color.WHITE,
          outlineWidth: 3,
          style: LabelStyle.FILL_AND_OUTLINE,
          verticalOrigin: VerticalOrigin.BOTTOM,
        })
      }
    />
  );
}
