import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import Loader from "../components/ui/loaders/loader";
import { verifyUserSession } from "../redux/authSlice";

const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const { loading, isInitialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
 
  useEffect(() => {
    // Only dispatch if we haven't initialized yet
    if (!isInitialized) {
      dispatch(verifyUserSession());
    }
  }, [dispatch, isInitialized]);

  // Show loader while we're checking authentication status
  if (!isInitialized || loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default AuthBootstrap;