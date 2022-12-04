import React from "react";
import { ReactComponent as SearchSvg } from "../../assets/icons/search.svg";
import { ReactComponent as CloseSvg } from "../../assets/icons/close.svg";
import "./SearchBar.scss";

interface ISearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

function SearchBar(props: ISearchBarProps) {
  const updateInputValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    props.onChange(value);
  };

  const clearInput = () => {
    props.onChange("");
  };

  return (
    <div className="SearchBar">
      <div className="SearchBar__input">
        <input
          type="text"
          className="SearchBar__input__field input"
          placeholder="Cerca una dimora"
          value={props.value}
          onChange={updateInputValue}
        />
        <button
          className="SearchBar__input__cancelButton"
          type="button"
          onClick={clearInput}
        >
          {props.value && (
            <CloseSvg className="SearchBar__input__cancelButton__icon" />
          )}
        </button>
      </div>
      <button
        className="btn SearchBar__button"
        type="button"
        onClick={props.onSearch}
      >
        <SearchSvg className="SearchBar__button__icon" />
        <span className="SearchBar__button__text">Cerca</span>
      </button>
    </div>
  );
}

export default SearchBar;
