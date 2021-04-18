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
import React, { useEffect, useState } from "react";
import { Entity, useCesium } from "resium";
import GliderTrackerClient from "../lib/glidertracker/client";

function log(
  time: string,
  id: string,
  lon: number,
  lat: number,
  alt: number,
  speed?: number
) {
  console.log(
    time,
    id,
    lon.toFixed(6),
    lat.toFixed(6),
    speed ? Math.round(speed) + "km/h" : "??? km/h",
    Math.round(alt) + "m"
  );
}

export default function Tracked() {
  const [pos, setPos] = useState([13.32477, 58.312519, 1089, 0]);

  const { viewer } = useCesium();

  useEffect(() => {
    const client = new GliderTrackerClient({ WebSocket });

    function connect() {
      client.connect().then(() => {
        client.setView([12.041016, 57.759868, 18.654785, 60.597756]);
        // client.getOverview([12.041016, 57.759868, 18.654785, 60.597756]);

        // client.requestTrack("06DDDAC1", 1618745182238, Date.now());
      });
    }

    connect();

    client.onTrack = function (id, fixes) {
      for (let fix of fixes) {
        log(
          new Date(fix.time).toISOString(),
          id,
          fix.lon,
          fix.lat,
          (fix.alt / 10) * 3
        );
      }
    };

    client.onClose = function () {
      console.log("Reconnecting...");
      connect();
    };

    client.onRecord = async function (record) {
      let data = record.data;

      // console.log(record);

      if (data && data.extension && record.from.call === "FLRDDC0E4") {
        let [lon, lat, alt, crs] = [
          parseFloat(data.longitude),
          parseFloat(data.latitude),
          data.altitude,
          data.extension.courseDeg,
        ];

        console.log(alt);

        setPos([lon, lat, alt, crs]);

        // log(
        //   data.timestamp,
        //   record.from.call,
        //   parseFloat(data.longitude),
        //   parseFloat(data.latitude),
        //   data.altitude,
        //   data.extension.speedMPerS * 3.6
        // );
      }
    };
    return () => client.disconnect();
  }, [viewer]);

  const [lon, lat, alt, track] = pos;
  console.log(pos);

  const cartesianPosition = Cartesian3.fromDegrees(lon, lat, alt + 30);

  const h = CMath.toRadians(track - 90);
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
      tracked
      label={
        new LabelGraphics({
          text: "SG",
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
