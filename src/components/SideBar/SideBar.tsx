import React from "react";
import { ReactComponent as BuildingSvg } from "../../assets/icons/building.svg";
import { ReactComponent as ClockSvg } from "../../assets/icons/clock.svg";
import { ReactComponent as InfoSvg } from "../../assets/icons/info.svg";
import { ReactComponent as SettingsSvg } from "../../assets/icons/settings.svg";
import { ReactComponent as LogoutSvg } from "../../assets/icons/logout.svg";
import logoImg from "../../assets/images/logo.jpg";
import SideBarLink from "./components/SideBarLink";

import "./SideBar.scss";
import SideBarButton from "./components/SideBarButton";
import { useDialog } from "../../store/dialogStore";

function SideBar() {
  const showDialog = useDialog((state) => state.showDialog);

  return (
    <nav className="SideBar">
      <img src={logoImg} alt="logo" className="SideBar__logo" />
      <div className="SideBar__links">
        <SideBarLink icon={BuildingSvg} to="/app/dimore" />
        <SideBarLink icon={ClockSvg} to="/app/itinerari" />
        <SideBarLink icon={InfoSvg} to="/app/credits" />
        <SideBarLink icon={SettingsSvg} to="/app/settings" />
        <div className="SideBar__links__logout">
          <SideBarButton icon={LogoutSvg} onClick={showDialog} />
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
