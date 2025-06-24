// hooks/useLogin.ts
import { useNavigate } from "react-router-dom";
import { signInUser } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hook";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await dispatch(signInUser(credentials)).unwrap();
      response.status && navigate("/chat");
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // let component decide how to handle/show
    }
  };

  return { login };
};
