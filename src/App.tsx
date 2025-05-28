import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import './pages/styles/global.css';
import LoadingSpinner from "./components/loading/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRouteProps";
import RedirectAcessScreen from "./pages/RedirectAcessScreen";

const LoginScreen = lazy(() => import("./pages/LoginScreen"));
const SelectProfile = lazy(() => import("./pages/SelectProfile"));
const ForgotPasswordScreen = lazy(() => import("./pages/ForgotPasswordScreen"));
const NotFoundScreen = lazy(() => import("./pages/NotFoundScreen"));
const DashboardScreen = lazy(() => import("./pages/DashboardScreen"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<RedirectAcessScreen />} />
          <Route path="/access" element={<SelectProfile />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route path="*" element={<NotFoundScreen />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardScreen />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;