import React from "react";

import ButtonBase from "@material-ui/core/ButtonBase";

const range = (min, max) => Array.from({ length: max - min }).fill(false);

const colors = [
  "hsla(1, 100%, 70%, 1)",
  "hsla(25, 100%, 70%, 1)",
  "hsla(50, 100%, 70%, 1)",
  "hsla(75, 100%, 70%, 1)",
  "hsla(99, 100%, 70%, 1)"
];

const Relevance = ({ value, max = 5, onChange }) => (
  <div>
    {range(0, max).map((_, i) => (
      <ButtonBase
        key={i}
        style={{
          background: colors[i % colors.length],
          border: value - 1 === i ? "1px solid #333" : "1px solid transparent",
          width: 30,
          height: 30,
          margin: "0 2px"
        }}
        onClick={() => onChange(i + 1)}
      >
        {i + 1}
      </ButtonBase>
    ))}
  </div>
);

export default Relevance;
