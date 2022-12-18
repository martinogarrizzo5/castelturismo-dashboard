import React, { useState } from "react";
import { useAuth } from "../../store/authStore";
import classNames from "classnames";
import logoImg from "../../assets/images/logo-min.jpg";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import "./LoginScreen.scss";

function LoginScreen() {
  const authState = useAuth();
  const [saveCredentials, setSaveCredentials] = useState<boolean>(false);

  const onCredentialsButtonClick = () => {
    setSaveCredentials((prevVal) => !prevVal);
  };

  const onFormSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    await authState.login("", "");
  };

  return (
    <main className="Login">
      <div className="Login__content">
        <div className="Login__logo-wrapper">
          <img src={logoImg} alt="logo" className="Login__logo" />
        </div>
        <h1 className="Login__title">
          <span className="brand__firstPart">castelfranco</span>
          <span className="brand__secondPart">VENETO</span>
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
