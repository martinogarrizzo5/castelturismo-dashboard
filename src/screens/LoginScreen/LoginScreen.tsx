import React, { useState } from "react";
import classNames from "classnames";
import logoImg from "../../assets/images/logo.jpg";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import "./LoginScreen.scss";

function LoginScreen() {
  const [saveCredentials, setSaveCredentials] = useState<boolean>(false);

  const onCredentialsButtonClick = () => {
    setSaveCredentials((prevVal) => !prevVal);
  };

  const onFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
  };

  return (
    <main className="Login">
      <div className="Login__content">
        <img src={logoImg} alt="logo" className="Login__logo" />
        <h1 className="Login__title">
          <span className="title Login__title__firstPart">castelfranco</span>
          <span className="title Login__title__secondPart">VENETO</span>
        </h1>
        <form className="Login__form" onSubmit={onFormSubmit}>
          <label className="Login__form__label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input Login__form__input"
            type="text"
            placeholder="Inserire username"
            autoComplete="off"
            autoCorrect="off"
          />
          <label className="Login__form__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input Login__form__input"
            type="password"
            placeholder="Inserire password"
          />
          <button type="submit" className="btn Login__form__submitButton">
            <span>Login Alla Dashboard</span>
          </button>
          <button
            className="Login__form__saveCredentials"
            type="button"
            onClick={onCredentialsButtonClick}
          >
            <div
              className={classNames(
                saveCredentials
                  ? "Login__form__saveCredentials__checkbox--selected"
                  : "Login__form__saveCredentials__checkbox"
              )}
            >
              {saveCredentials && (
                <CheckSvg className="Login__form__saveCredentials__checkbox__check" />
              )}
            </div>
            <p className="Login__saveCredentials__text description">
              Salva Credenziali
            </p>
          </button>
        </form>
      </div>
      <p className="Login__credits">&copy; Made With ❤️ By Martin Meneghetti</p>
    </main>
  );
}

export default LoginScreen;
