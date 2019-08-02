import React from "react";

import FuseInput from "../lib/FuseInput";

import themes from "../themes.json";

const getSuggestionValue = suggestion => suggestion.item.title;

const ThemePicker = props => (
  <FuseInput
    data={themes}
    placeholder="Choisissez le thème"
    labelKey="title"
    getSuggestionValue={getSuggestionValue}
    {...props}
  />
);

export default ThemePicker;
