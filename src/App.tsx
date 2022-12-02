import { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import LoginScreen from "./screens/LoginScreen";
import DashboardScreen from "./screens/DashBoard/Dashboard";
import DimoreScreen from "./screens/DimoreScreen";
import DimoraDetailsScreen from "./screens/DimoraDetailsScreen";
import NotFoundScreen from "./screens/NotFoundScreen";
import ItinerariScreen from "./screens/ItinerariScreen";
import ItinerarioDetailsScreen from "./screens/ItinerarioDetailsScreen";
import CreditsScreen from "./screens/CreditsScreen";
import SettingsScreen from "./screens/SettingsScreen";

function App() {
  const [token, setToken] = useState<string | null>("test");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    // auth guards
    if (token === null && path === "/login") return;
    if (token === null) return navigate("/login", { replace: true });

    if (path === "/" || path === "/login" || path === "/app")
      return navigate("/app/dimore", { replace: true });
  }, [token, location]);

  return (
    <div>
      <Routes>
        <Route path="/app/*" element={<DashboardScreen />}>
          <Route path="dimore" element={<DimoreScreen />} />
          <Route path="dimore/:id" element={<DimoraDetailsScreen />} />
          <Route path="itinerario" element={<ItinerariScreen />} />
          <Route path="itinerario/:id" element={<ItinerarioDetailsScreen />} />
          <Route path="credits" element={<CreditsScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
        </Route>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </div>
  );
}

export default App;
