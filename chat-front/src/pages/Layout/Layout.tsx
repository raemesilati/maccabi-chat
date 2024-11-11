import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../Login/Login";
import SignUpPage from "../Signup/Signup";
import ChatPage from "../Chat/Chat";
import GuardedRoute from "./../../guards/routeGuard";
import classes from "./Layout.module.scss";
import logo from "../../assets/icons/logo.svg";

const LayoutPage = () => {
  return (
    <div className={classes.chatBackground}>
      <img src={logo} alt="" className={classes.logo} />
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<LoginPage />}></Route>
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/chat"
            element={<GuardedRoute element={<ChatPage />} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default LayoutPage;
