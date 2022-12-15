import React from "react";
import "./ScreenOverlay.scss";

interface IScreenOverlay {
  onClick?: () => void;
}

function ScreenOverlay(props: IScreenOverlay) {
  return <div className="ScreenOverlay" onClick={props.onClick}></div>;
}

export default ScreenOverlay;
