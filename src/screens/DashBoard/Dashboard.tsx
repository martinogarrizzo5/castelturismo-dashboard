import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import "./Dashboard.scss";

function DashboardScreen() {
  return (
    <div className="Dashboard">
      <SideBar />
      <main className="Dashboard__content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardScreen;
