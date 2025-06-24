import { Route, Routes } from "react-router-dom";
import { PAGES } from "../pages";
import ProtectedRoute from "./protectedRoute";
import { useLogin } from "../hooks/auth/useLogin";
import { useEffect } from "react";

const AppRouter = () => {
  const { verifyToken } = useLogin();
  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
      <Route path="/sign-in" element={<PAGES.AUTH.SIGN_IN />} />
      <Route path="/sign-up" element={<PAGES.AUTH.SIGN_UP />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/chat" element={<PAGES.CHAT_SCREEN />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
