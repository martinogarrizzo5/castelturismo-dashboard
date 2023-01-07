import React from "react";
import { ReactComponent as SearchSvg } from "../../assets/icons/search.svg";
import { ReactComponent as CloseSvg } from "../../assets/icons/close.svg";
import "./SearchBar.scss";

interface ISearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onDeleteSearch?: () => void;
}

function SearchBar(props: ISearchBarProps) {
  const updateInputValue = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    props.onChange(value);
  };

  const clearInput = () => {
    props.onChange("");
  };

  const onEnterClick = (e: any) => {
    e.preventDefault();
    props.onSearch(props.value);
  };

  const onSearchDelete = () => {
    clearInput();
    if (props.onDeleteSearch) {
      props.onDeleteSearch();
    }
  };

  return (
    <form className="SearchBar" onSubmit={onEnterClick}>
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
          onClick={onSearchDelete}
        >
          {props.value && (
            <CloseSvg className="SearchBar__input__cancelButton__icon" />
          )}
        </button>
      </div>
      <button
        className="btn SearchBar__button"
        type="button"
        onClick={() => props.onSearch(props.value)}
      >
        <SearchSvg className="SearchBar__button__icon" />
        <span className="SearchBar__button__text">Cerca</span>
      </button>
    </form>
  );
}

export default SearchBar;
