import React from "react";
import { ReactComponent as BuildingSvg } from "../../assets/icons/building.svg";
import { ReactComponent as ClockSvg } from "../../assets/icons/clock.svg";
import { ReactComponent as InfoSvg } from "../../assets/icons/info.svg";
import { ReactComponent as SettingsSvg } from "../../assets/icons/settings.svg";
import logoImg from "../../assets/images/logo.jpg";

import "./SideBar.scss";

function SideBar() {
  return (
    <nav className="SideBar">
      <img src={logoImg} alt="logo" className="SideBar__logo" />
    </nav>
  );
}

export default SideBar;
