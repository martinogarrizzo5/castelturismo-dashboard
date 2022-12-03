import React, { FC, SVGProps } from "react";
import "./SideBarLink.scss";

interface SideBarButtonProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  onClick: () => void;
}

function SideBarButton(props: SideBarButtonProps) {
  return (
    <button onClick={props.onClick} className="SideBarLink">
      <props.icon className="SideBarLink__icon" />
    </button>
  );
}

export default SideBarButton;
