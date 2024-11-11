import { IInput } from "../../components/Inputs/input.interface";
import TextInput from "../../components/Inputs/TextInput/TextInput";
import { loginInputs } from "./loginInputs";
import { Link } from "react-router-dom";
import classes from "./Login.module.scss";
import arrowIcon from "../../assets/icons/arrow.svg";
import useLogin from "./useLogin";
import { ILoginForm } from "./Login.interface";

const LoginPage = () => {
  const { error, isLoading, loginForm, handleLogin, handleInputChange } =
    useLogin();

  return (
    <div className={classes.loginPage}>
      <h1 className={classes.title}>כניסה למערכת</h1>
      <form onSubmit={handleLogin} className={classes.form}>
        {error && <div className={classes.error}>{error}</div>}
        {loginInputs.map((input: IInput) => (
          <div key={input.name} className={classes.inputWrapper}>
            <TextInput
              {...input}
              value={loginForm[input.name as keyof ILoginForm]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={isLoading}
          className={classes.submitButton}
        >
          {isLoading ? "מתחבר..." : "התחבר"}
          <img src={arrowIcon} alt="" />
        </button>
      </form>
      <p className={classes.signupPrompt}>
        אין לך משתמש?{" "}
        <Link to="/signup" className={classes.signupLink}>
          הרשם כאן!
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
