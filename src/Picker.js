import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";

import { getLabelBySource } from "./sources";

// handle query + results state
class SuggestionState extends React.Component {
  state = { query: this.props.query, hits: [] };
  componentWillReceiveProps(nextProps) {
    this.setState({ query: nextProps.query, hits: [] });
  }
  updateQuery = query => {
    this.setState({ query, hits: [] }, () => {
      this.props
        .fetchSuggestions(query)
        .then(results => results.hits.hits)
        .then(hits => this.setState({ hits }));
    });
  };
  render() {
    return this.props.render({
      query: this.state.query,
      hits: this.state.hits,
      updateQuery: this.updateQuery,
      forceUpdate: this.forceUpdate.bind(this)
    });
  }
}

const renderInputComponent = inputProps => (
  <TextField {...inputProps} innerRef={inputProps.ref} />
);

export const Picker = ({ query, onSelect, fetchSuggestions }) => {
  const originalQuery = query;
  return (
    <SuggestionState
      fetchSuggestions={fetchSuggestions}
      query={originalQuery}
      render={({ query, hits, updateQuery, forceUpdate }) => {
        const _onChange = args => {};
        const _onSearch = e => {
          updateQuery(e.value);
        };
        const _onSelect = (event, data) => {
          onSelect(data.suggestion);
          forceUpdate();
        };
        const _onClear = args => {
          updateQuery(originalQuery);
        };
        const inputProps = {
          name: "query",
          placeholder: "ex: L4212",
          type: "search",
          fullWidth: true,
          value: query,
          onChange: _onChange
        };
        return (
          <Autosuggest
            theme={suggesterTheme}
            suggestions={hits}
            focusInputOnSuggestionClick={false} // prevent some ref issues
            alwaysRenderSuggestions={false}
            onSuggestionSelected={_onSelect}
            onSuggestionsFetchRequested={_onSearch}
            onSuggestionsClearRequested={_onClear}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSuggestionsContainer={renderSuggestionsContainer}
            renderInputComponent={renderInputComponent}
            inputProps={inputProps}
          />
        );
      }}
    />
  );
};

const getSuggestionValue = suggestion => suggestion._source.title;

const cleanHtml = html =>
  html
    .trim()
    .replace(/^(<br\/?>)+/, "")
    .replace(/((<br\/?>)+)$/, "")
    .replace(/^(<p>)+/, "")
    .replace(/((<\/p>)+)$/, "");

const SuggestionContainer = styled.div`
  p {
    margin: 0;
  }
`;

const renderSuggestion = suggestion => {
  const source = getLabelBySource(suggestion._source.source);
  return (
    <SuggestionContainer>
      <b>
        {source ? `${source} | ` : ""} {suggestion._source.title}
      </b>
      <br />
      <div
        dangerouslySetInnerHTML={{
          __html: cleanHtml(
            (suggestion.highlight &&
              suggestion.highlight["all_text.french_exact"] &&
              suggestion.highlight["all_text.french_exact"][0]) ||
              ""
          )
        }}
      />
    </SuggestionContainer>
  );
};

const SuggestionsContainer = styled.div`
  white-space: "nowrap";
  text-overflow: "ellipsis";
  width: "90%";
  overflow: "hidden";

  ul {
    z-index: 100;
  }
  li[role="option"]:nth-child(2n + 1) {
    background: #f7f7f7;
  }
`;

const renderSuggestionsContainer = ({ containerProps, children }) => (
  <SuggestionsContainer {...containerProps}>{children}</SuggestionsContainer>
);

// see https://github.com/moroshko/react-autosuggest#themeProp
const suggesterTheme = {
  container: {
    flex: "1 1 80%",
    textAlign: "left",
    border: 0,
    position: "relative"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    marginTop: ".5em",
    paddingTop: "0",
    border: "1px solid silver",
    borderRadius: "3px",
    background: "white",
    position: "absolute",
    zIndex: 10,
    left: 0,
    right: 0,
    boxShadow: "0 10px 10px -10px #b7bcdf"
  },
  suggestion: {
    listStyleType: "none",
    borderRadius: "3px",
    padding: 5,
    lineHeight: "2rem",
    cursor: "pointer"
  },
  suggestionHighlighted: {
    background: "#eee"
  }
};

export default Picker;
