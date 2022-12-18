import React from "react";
import Spinner from "../../components/Spinner/Spinner";
import logoImg from "../../assets/images/logo-min.jpg";
import "./LoadingScreen.scss";

function LoadingScreen() {
  return (
    <div className="Loading">
      <h1 className="Login__title">
        <div className="Loading__logo-wrapper">
          <img src={logoImg} alt="logo" className="Loading__logo" />
        </div>
        <span className="title brand__firstPart">castelfranco</span>
        <span className="title brand__secondPart">VENETO</span>
      </h1>
      <Spinner className="LoadingScreen__spinner" />
    </div>
  );
}

export default LoadingScreen;
