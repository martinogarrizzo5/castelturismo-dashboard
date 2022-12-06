import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as BackSvg } from "../../assets/icons/back.svg";
import "./DimoraDetailsScreen.scss";

export enum DimoraDetailsAction {
  Add,
  Edit,
}

interface IDimoraDetailsScreenProps {
  action: DimoraDetailsAction;
}

function DimoraDetailsScreen(props: IDimoraDetailsScreenProps) {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <main className="page DimoraDetails">
      <div className="DimoraDetails__titleSection">
        <button
          className="input DimoraDetails__backButton"
          onClick={handleBackButtonClick}
        >
          <BackSvg className="DimoraDetails__backButton__icon" />
        </button>
        <h1 className="title DimoraDetails__titleSection__title">
          {props.action === DimoraDetailsAction.Add
            ? "Crea Nuova Dimora"
            : "Modifica Dimora"}
        </h1>
      </div>
    </main>
  );
}

export default DimoraDetailsScreen;
