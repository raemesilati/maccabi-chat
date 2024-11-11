import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAPIMutation from "../../hooks/useApi";
import { useUser } from "../../contexts/userContext";
import { ISignupForm } from "./Signup.interface";

const useSignup = () => {
  const [signupForm, setSignupForm] = useState<ISignupForm>({} as ISignupForm);
  const [error, setError] = useState<string>();
  const { mutate: signup, isLoading } = useAPIMutation("api/auth/signup");
  const { updateContext } = useUser();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupForm.password === signupForm.confirmPassword) {
      signup(
        { body: signupForm },
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
    } else {
      setError("הסיסמאות אינן תואמות");
    }
  };

  const handleInputChange = (input: HTMLInputElement) => {
    setSignupForm((prev) => ({
      ...prev,
      [input.name]: input.value,
    }));
  };

  return {
    error,
    isLoading,
    signupForm,
    handleInputChange,
    handleSignup,
  };
};

export default useSignup;
