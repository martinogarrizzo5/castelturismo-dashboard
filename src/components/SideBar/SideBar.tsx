import React from "react";
import { ReactComponent as BuildingSvg } from "../../assets/icons/building.svg";
import { ReactComponent as ClockSvg } from "../../assets/icons/clock.svg";
import { ReactComponent as InfoSvg } from "../../assets/icons/info.svg";
import { ReactComponent as SettingsSvg } from "../../assets/icons/settings.svg";
import { ReactComponent as LogoutSvg } from "../../assets/icons/logout.svg";
import logoImg from "../../assets/images/logo-min.jpg";
import SideBarLink from "./components/SideBarLink";

import "./SideBar.scss";
import SideBarButton from "./components/SideBarButton";
import { useDialog } from "../../store/dialogStore";
import { useAuth } from "../../store/authStore";

function SideBar() {
  const dialogState = useDialog();
  const authState = useAuth();

  const onLogout = () => {
    dialogState.setDialog({
      title: "Vuoi veramente uscire?",
      subTitle: "Dovrai eseguire il login di nuovo per accedere alla dashboard",
      mainActionTitle: "Annulla",
      sideActionTitle: "Conferma Logout",
      onMainActionClick: dialogState.dismissDialog,
      onSideActionClick: () => {
        authState.logout();
        dialogState.dismissDialog();
      },
    });
    dialogState.showDialog();
  };

  return (
    <nav className="SideBar">
      <div className="SideBar__logo-wrapper">
        <img src={logoImg} alt="logo" className="SideBar__logo" />
      </div>
      <div className="SideBar__links">
        <SideBarLink icon={BuildingSvg} to="/app/dimore" />
        <SideBarLink icon={ClockSvg} to="/app/itinerari" />
        <SideBarLink icon={InfoSvg} to="/app/credits" />
        {/* <SideBarLink icon={SettingsSvg} to="/app/settings" /> */}
        <div className="SideBar__links__logout">
          <SideBarButton icon={LogoutSvg} onClick={onLogout} />
        </div>
      </div>
    </nav>
  );
}

export default SideBar;
