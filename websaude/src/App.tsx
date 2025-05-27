import { Route, Routes, BrowserRouter } from "react-router-dom";
import LoginScreen from "./pages/LoginScreen";
import SelectProfile from "./pages/SelectProfile";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import NotFoundScreen from "./pages/NotFoundScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={SelectProfile} />
        <Route path="/login" Component={LoginScreen} />
        <Route path="/forgot-password" Component={ForgotPasswordScreen} />
        <Route path="*" Component={NotFoundScreen} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
