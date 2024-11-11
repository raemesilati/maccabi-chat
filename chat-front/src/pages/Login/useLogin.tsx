import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPIMutation from "../../hooks/useApi";
import { useUser } from "../../contexts/userContext";
import { ILoginForm } from "./Login.interface";

const useLogin = () => {
  const { updateContext } = useUser();
  const [error, setError] = useState<string>();
  const [loginForm, setLoginForm] = useState<ILoginForm>({} as ILoginForm);
  const { mutate: login, isLoading } = useAPIMutation("api/auth/login");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(
      { body: loginForm },
      {
        onSuccess: (data) => {
          updateContext(data);
          navigate("/chat");
        },
        onError: (error: any) => {
          setError(error.message);
        },
      }
    );
  };

  const handleInputChange = (input: HTMLInputElement) => {
    setLoginForm((prev) => ({
      ...prev,
      [input.name]: input.value,
    }));
  };

  return {
    error,
    isLoading,
    loginForm,
    handleLogin,
    handleInputChange,
  };
};

export default useLogin;
