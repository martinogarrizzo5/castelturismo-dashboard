import { ClassNamesConfig, GroupBase } from "react-select";

export const dropDownStyles: ClassNamesConfig<any, false, GroupBase<any>> = {
  container: (state) => "dropdown",
  control: (state) => "input dropdown__control",
  valueContainer: (state) => "DimoraDetials__fields__dropdown__valueContainer",
  clearIndicator: (state) => "dropdown__clearIndicator",
  menu: (state) => "dropdown__menu",
  menuList: (state) => "dropdown__menuList",
  option: (state) =>
    state.isSelected ? "dropdown__option--selected" : "dropdown__option",
  noOptionsMessage: (state) => "dropdown__noOptionsMessage",
  placeholder: (state) => "description dropdown__placeholder",
  multiValue: (state) => "multiDropdown__multiValue",
  multiValueRemove: (state) => "multiDropdown__multiValue__remove",
};
