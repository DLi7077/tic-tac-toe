import React from "react";

export default function Cell({ value, onClick }) {
  const cellStyle = {
    backgroundColor: "hsl(210,10%,20%)",
    outline: "2px solid white",
    height: "100px",
    width: "100px",
    fontSize: "4rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={cellStyle} onClick={onClick}>
      {!!value ? value : "_"}
    </div>
  );
}
