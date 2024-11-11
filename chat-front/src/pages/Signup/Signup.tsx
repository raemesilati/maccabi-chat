import React, { useState } from "react";
import { IInput } from "../../components/Inputs/input.interface";
import TextInput from "../../components/Inputs/TextInput/TextInput";
import useAPIMutation from "../../hooks/useApi";
import { useUser } from "../../contexts/userContext";
import { signupInputs } from "./signupInputs";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Signup.module.scss";
import arrowIcon from "../../assets/icons/arrow.svg";
import useSignup from "./useSignup";

interface ISignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const { error, isLoading, signupForm, handleInputChange, handleSignup } =
    useSignup();
  return (
    <div className={classes.signupPage}>
      <h1 className={classes.title}>הרשמה</h1>
      <form onSubmit={handleSignup}>
        {error && <div className={classes.error}>{error}</div>}
        {signupInputs.map((input: IInput) => (
          <div>
            <TextInput
              key={input.name}
              {...input}
              value={signupForm[input.name as keyof ISignupForm]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className={classes.submitButton}
        >
          {isLoading ? "יוצר..." : "צור משתמש"}
          <img src={arrowIcon} alt="" />
        </button>
      </form>
      <p className={classes.signinPrompt}>
        יש לך משתמש?{" "}
        <Link to="/login" className={classes.signupLink}>
          הכנס עכשיו!
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
