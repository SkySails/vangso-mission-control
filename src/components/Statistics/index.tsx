import React, { useState } from "react";
import { useAircrafts } from "../../context/aircraftContext";
import usePrevious from "../../hooks/usePrevious";

type SortedField = null | "cn" | "speed" | "altitude" | "call" | "climbrate";

export default function Statistics() {
  const [sortedField, setSortedField] = useState<SortedField>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { aircraft, setTrackedAircraft, trackedAircraft } = useAircrafts();

  let sortedAircraft = Object.values(aircraft).filter((val) => val.altitude);

  if (sortedField) {
    sortedAircraft.sort((a, b) => {
      if (a[sortedField] < b[sortedField]) {
        return sortOrder === "desc" ? 1 : -1;
      }
      if (a[sortedField] > b[sortedField]) {
        return sortOrder === "desc" ? -1 : 1;
      }
      return 0;
    });
  }

  const onSort = (field: SortedField) => {
    if (sortedField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortedField(field);
    }
  };

  return (
    <aside style={{ padding: "10px" }}>
      <table className="overview-table" style={{ textAlign: "left" }}>
        <thead>
          <tr>
            <th onClick={() => onSort("call")}>Callsign</th>
            <th onClick={() => onSort("cn")}>CN</th>
            <th onClick={() => onSort("speed")}>Speed</th>
            <th onClick={() => onSort("climbrate")}>vs</th>
            <th onClick={() => onSort("altitude")}>Altitude</th>
          </tr>
        </thead>
        <tbody>
          {sortedAircraft.map((data) => (
            <tr
              onAnimationEnd={(e) => e.currentTarget.classList.remove("flash")}
              key={`${data.id}-${data.cn}-${data.type}`}
              onClick={() => setTrackedAircraft(data.id)}
              style={
                trackedAircraft === data.id
                  ? {
                      background: "rgba(0, 162, 255, 0.4)",
                    }
                  : undefined
              }
            >
              <Cell value={data.call} />
              <Cell value={data.cn} />
              <Cell value={Math.round(data.speed * 1.852)} />
              <Cell value={(data.climbrate / 60).toFixed(1) as string} />
              <Cell value={data.altitude} />
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
}

function Cell({ value }: { value: string | number }) {
  const previousValue = usePrevious(value) || 0;
  return (
    <td
      style={{
        animationName: previousValue > value ? "redflash" : "greenflash",
        animationFillMode: "forwards",
        animationDuration: "1s",
      }}
    >
      {value}
    </td>
  );
}
