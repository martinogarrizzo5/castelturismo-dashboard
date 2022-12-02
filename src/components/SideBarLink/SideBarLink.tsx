import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import "./SideBarLink.scss";

interface SideBarLinkProps {
  icon: FC;
  to: string;
}

function SideBarLink(props: SideBarLinkProps) {
  return <NavLink to={props.to}></NavLink>;
}

export default SideBarLink;
