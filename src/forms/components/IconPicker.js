import React from "react";
import { icons } from "@socialgouv/react-ui";

const IconPicker = ({ value, onChange }) => (
  <div>
    {Object.keys(icons).map(key => {
      const Icon = icons[key];
      const selectedStyle = value === key ? { border: "1px solid #666" } : {};
      return (
        <Icon
          onClick={() => onChange(key)}
          key={key}
          title={key}
          style={{
            cursor: "pointer",
            width: 50,
            margin: 10,
            padding: 10,
            ...selectedStyle
          }}
        />
      );
    })}
  </div>
);

export default IconPicker;
