import React from "react";

import FuseInput from "../../lib/FuseInput";
import ListRecords from "../../kinto/ListRecords";
import fuseInputTheme from "./fuseInputTheme";

const getSuggestionValue = suggestion => suggestion.item && suggestion.item.title || "";

const ThemePicker = props => (
  <ListRecords
    bucket="datasets"
    collection="themes"
    render={({ result }) => {
      const currentTheme =
        result && result.data.find(t => t.id === props.value);
      return (
        <FuseInput
          theme={fuseInputTheme}
          data={[{ id: null, title: "Aucun" }].concat(result.data)}
          placeholder="Choisissez le thème"
          labelKey="title"
          getSuggestionValue={getSuggestionValue}
          {...props}
          value={currentTheme && currentTheme.title || ""}
        />
      );
    }}
  />
);

export default ThemePicker;
