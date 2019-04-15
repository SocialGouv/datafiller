import React from "react";

import FuseInput from "../lib/FuseInput";

import themes from "../themes.json";

const Picker = props => (
  <FuseInput
    data={themes}
    placeholder="Choisissez le thème"
    labelKey="title"
    getSuggestionValue={suggestion => suggestion.item.title}
    {...props}
  />
);

export default Picker;
