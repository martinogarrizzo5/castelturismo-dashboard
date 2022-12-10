import React from "react";
import { ReactComponent as BackSvg } from "../../assets/icons/back.svg";
import { useNavigate } from "react-router-dom";
import "./BackButton.scss";

function BackButton() {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <button className="backButton" onClick={handleBackButtonClick}>
      <BackSvg className="backButton__icon" />
    </button>
  );
}

export default BackButton;
