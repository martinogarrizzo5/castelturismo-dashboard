import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";

function DashboardScreen() {
  return (
    <div>
      <nav></nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardScreen;
