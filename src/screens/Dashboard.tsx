import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

function DashboardScreen() {
  return (
    <div>
      <SideBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardScreen;
