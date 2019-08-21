import React from "react";

import FuseInput from "../lib/FuseInput";
import themes from "../themes.json";
import fuseInputTheme from "./fuseInputTheme";

const getSuggestionValue = suggestion => suggestion.item.title;

const ThemePicker = props => (
  <FuseInput
    theme={fuseInputTheme}
    data={themes}
    placeholder="Choisissez le thème"
    labelKey="title"
    getSuggestionValue={getSuggestionValue}
    {...props}
  />
);

export default ThemePicker;
