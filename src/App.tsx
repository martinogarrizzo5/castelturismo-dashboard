import { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen/LoginScreen";
import DashboardScreen from "./screens/DashBoard/Dashboard";
import DimoreScreen from "./screens/DimoreScreen/DimoreScreen";
import DimoraDetailsScreen, {
  DimoraDetailsPageType,
} from "./screens/DimoraDetailsScreen/DimoraDetailsScreen";
import ItinerariScreen from "./screens/ItinerariScreen/ItinerariScreen";
import ItinerarioDetailsScreen, {
  PageType as ItinerarioDetailsPageType,
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
    if (authState.isUserLoading) return;
    if (authState.user === null && path === "/login") return;
    if (authState.user === null) return navigate("/login", { replace: true });

    // redirect to dashboard if user is logged in
    if (path === "/" || path === "/login" || path === "/app")
      return navigate("/app/dimore", { replace: true });
  }, [authState, location]);

  if (authState.isUserLoading) return <LoadingScreen />;
  return (
    <Routes>
      <Route path="/app/*" element={<DashboardScreen />}>
        <Route path="dimore" element={<DimoreScreen />} />
        <Route
          path="dimore/:id"
          element={
            <DimoraDetailsScreen pageType={DimoraDetailsPageType.Edit} />
          }
        />
        <Route
          path="dimore/new"
          element={<DimoraDetailsScreen pageType={DimoraDetailsPageType.Add} />}
        />
        <Route path="itinerari" element={<ItinerariScreen />} />
        <Route
          path="itinerari/:id"
          element={
            <ItinerarioDetailsScreen
              pageType={ItinerarioDetailsPageType.Edit}
            />
          }
        />
        <Route
          path="itinerari/new"
          element={
            <ItinerarioDetailsScreen pageType={ItinerarioDetailsPageType.Add} />
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
