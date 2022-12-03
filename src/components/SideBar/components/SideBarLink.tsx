import React, { FC, SVGProps } from "react";
import { NavLink } from "react-router-dom";
import "./SideBarLink.scss";

interface SideBarLinkProps {
  icon: FC<SVGProps<SVGSVGElement>>;
  to: string;
}

function SideBarLink(props: SideBarLinkProps) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        isActive ? "SideBarLink--active" : "SideBarLink"
      }
    >
      <props.icon className="SideBarLink__icon" />
    </NavLink>
  );
}

export default SideBarLink;
