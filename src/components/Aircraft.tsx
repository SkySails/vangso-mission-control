import {
  Cartesian3,
  Cartographic,
  Color,
  ConstantProperty,
  HeadingPitchRoll,
  LabelGraphics,
  Math as CMath,
  sampleTerrainMostDetailed,
  Transforms,
} from "cesium";
import Cartesian2 from "cesium/Source/Core/Cartesian2";
import LabelStyle from "cesium/Source/Scene/LabelStyle";
import VerticalOrigin from "cesium/Source/Scene/VerticalOrigin";
import React, { useEffect, useState } from "react";
import { Entity, useCesium } from "resium";
import { Aircraft } from "../context/aircraftContext";

export default function Tracked({
  data,
  tracked,
}: {
  data: Aircraft;
  tracked?: boolean;
}) {
  let [lon, lat, alt, heading, roll] = [
    data.lon,
    data.lat,
    data.altitude,
    data.heading,
    data.rotation,
  ];
  const [elevation, setElevation] = useState(0);
  const { viewer } = useCesium();

  useEffect(() => {
    if (viewer && lon && lat) {
      sampleTerrainMostDetailed(viewer.terrainProvider, [
        Cartographic.fromDegrees(lon, lat, 0),
      ]).then((data) => setElevation(data[0].height));
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [alt]);

  if (typeof lon !== "number") return null;

  const altitude = Math.max(elevation, alt);

  const cartesianPosition = Cartesian3.fromDegrees(lon, lat, altitude);

  const h = CMath.toRadians(heading - 90);
  const p = 0;
  const r = roll / 6;

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
      {...{ tracked }}
    />
  );
}
