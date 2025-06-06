import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { colors, ROUTES, screenSize } from "./constants";
import { useAuth } from "./context/authContext";
import { Stack, useMediaQuery } from "@mui/material";
import Home from "./pages/home";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import VestingSchedulePage from "./pages/vestingSchedule/VestingSchedulePage";
import ManageGrantsPage from "./pages/manageGrants";
import PayLensPage from "./pages/paylens";
import MyEarnings from "./pages/myEarnings";

function App() {
  const { user, isLoggedIn } = useAuth();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const isPcAndAbove = useMediaQuery(`(min-width:${screenSize.pc})`);
  const isMobile = useMediaQuery(`(max-width:${screenSize.mobile})`);

  const {
    REGISTER,
    LOGIN,
    DASHBOARD,
    PROFILE,
    VESTING_SCHEDULE,
    MANAGE_GRANTS,
    PAYLENS,
    MY_EARNINGS,
  } = ROUTES;

  return (
    <Stack
      sx={{
        height: "100vh",
        minHeight: "100vh",
        margin: 0,
        bgcolor: colors.darkGrey1,
      }}
    >
      <Header />
      <Stack
        sx={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Routes>
          <Route path={REGISTER} element={<Home />}>
            <Route element={<Register />} index />
            <Route element={<Login />} path={LOGIN} />
          </Route>
        </Routes>
        {isLoggedIn && (
          <Stack
            sx={{
              maxWidth: "1300px",
              ...(isPcAndAbove && { width: "100%" }),
              margin: isTablet ? "0" : "0 auto",
              padding: isMobile ? 2 : 3,
            }}
          >
            <Routes>
              <Route path="" element={<ProtectedRoute />}>
                <Route
                  element={<Dashboard userInfo={user} />}
                  path={DASHBOARD}
                />
                <Route element={<Profile />} path={PROFILE} />
                <Route
                  element={<VestingSchedulePage />}
                  path={VESTING_SCHEDULE}
                />
                <Route element={<ManageGrantsPage />} path={MANAGE_GRANTS} />
                <Route element={<PayLensPage />} path={PAYLENS} />
                <Route element={<MyEarnings />} path={MY_EARNINGS} />
              </Route>
            </Routes>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

export default App;
