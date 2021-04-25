import React, { useState } from "react";
import { useAircrafts } from "../../context/aircraftContext";
import usePrevious from "../../hooks/usePrevious";

type SortedField = null | "cn" | "speed" | "altitude";

export default function Statistics() {
  const [sortedField, setSortedField] = useState<SortedField>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { aircraft } = useAircrafts();

  let sortedAircraft = [...Object.values(aircraft)];

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
    <aside>
      <table>
        <thead>
          <tr>
            <th onClick={() => onSort("cn")}>CN</th>
            <th onClick={() => onSort("speed")}>Speed</th>
            <th onClick={() => onSort("altitude")}>Altitude</th>
          </tr>
        </thead>
        <tbody>
          {sortedAircraft.map((data) => (
            <tr
              onAnimationEnd={(e) => e.currentTarget.classList.remove("flash")}
              key={`${data.id}-${data.cn}-${data.type}`}
            >
              <Cell value={data.call} />
              <Cell value={data.cn} />
              <Cell value={data.speed} />
              <Cell value={(data.altitude / 3.281).toFixed(1) as string} />
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
