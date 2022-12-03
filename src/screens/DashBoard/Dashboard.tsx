import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import "./Dashboard.scss";

function DashboardScreen() {
  return (
    <div className="Dashboard">
      <SideBar />
      <Outlet />
    </div>
  );
}

export default DashboardScreen;
