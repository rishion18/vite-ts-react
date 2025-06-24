// hooks/useLogin.ts
import { useNavigate } from "react-router-dom";
import { signInUser, verifyUserSession } from "../../redux/authSlice";
import { useAppDispatch } from "../../redux/hook";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await dispatch(signInUser(credentials)).unwrap();
      console.log("Login successful:", response.token);
      if(response.token){
        navigate('/chat')
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // let component decide how to handle/show
    }
  };

  const verifyToken  = async () => {
    try{
      const response = await dispatch(verifyUserSession()).unwrap();
      console.log("Token verification successful:", response);
    }catch(error){
      console.error("Token verification failed:", error);
      throw error; // let component decide how to handle/show
    }
  }

  return { login, verifyToken };
};
