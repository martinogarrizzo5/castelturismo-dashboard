import { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import DashboardScreen from "./screens/DashBoard/Dashboard";
import DimoreScreen from "./screens/DimoreScreen/DimoreScreen";
import DimoraDetailsScreen, {
  DimoraDetailsAction,
} from "./screens/DimoraDetailsScreen/DimoraDetailsScreen";
import ItinerariScreen from "./screens/ItinerariScreen/ItinerariScreen";
import ItinerarioDetailsScreen, {
  ItinerarioDetailsAction,
} from "./screens/ItinerarioDetailsScreen/ItinerarioDetailsScreen";
import CreditsScreen from "./screens/CreditsScreen/CreditsScreen";
import SettingsScreen from "./screens/SettingsScreen/SettingsScreen";
import { useAuth } from "./store/authStore";
import LoadingScreen from "./screens/LoadingScreen/LoadingScreen";

function App() {
  const authState = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authState.fetchUser();
  }, []);

  useEffect(() => {
    const path = location.pathname;

    // auth guards
    if (authState.isLogging) return;
    if (authState.token === null && path === "/login") return;
    if (authState.token === null) return navigate("/login", { replace: true });

    // TODO: send token to server to check if it's valid

    // redirect to dashboard if user is logged in
    if (path === "/" || path === "/login" || path === "/app")
      return navigate("/app/dimore", { replace: true });
  }, [authState, location]);

  if (authState.isLogging) return <LoadingScreen />;
  return (
    <Routes>
      <Route path="/app/*" element={<DashboardScreen />}>
        <Route path="dimore" element={<DimoreScreen />} />
        <Route
          path="dimore/:id"
          element={<DimoraDetailsScreen action={DimoraDetailsAction.Edit} />}
        />
        <Route
          path="dimore/new"
          element={<DimoraDetailsScreen action={DimoraDetailsAction.Add} />}
        />
        <Route path="itinerari" element={<ItinerariScreen />} />
        <Route
          path="itinerari/:id"
          element={
            <ItinerarioDetailsScreen action={ItinerarioDetailsAction.Edit} />
          }
        />
        <Route
          path="itinerari/new"
          element={
            <ItinerarioDetailsScreen action={ItinerarioDetailsAction.Add} />
          }
        />
        <Route path="credits" element={<CreditsScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Route>
      <Route path="/login" element={<LoginScreen />} />
    </Routes>
  );
}

export default App;
