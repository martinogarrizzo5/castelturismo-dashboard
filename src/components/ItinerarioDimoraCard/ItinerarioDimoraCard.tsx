import React from "react";
import Dimora from "../../data/models/dimora";
import { ReactComponent as RemoveSvg } from "../../assets/icons/close.svg";
import "./ItinerarioDimoraCard.scss";

interface IItinerarioDimoraCardProps {
  position: number;
  dimora: Dimora;
  onRemove: () => void;
}

function ItinerarioDimoraCard(props: IItinerarioDimoraCardProps) {
  return (
    <div className="ItinerarioDimoraCard">
      <img
        src={props.dimora.coverPath}
        alt="dimora"
        className="ItinerarioDimoraCard__img"
      />
      <div className="ItinerarioDimoraCard__position-badge">
        <span>{props.position}</span>
      </div>
      <p className="ItinerarioDimoraCard__nome">{props.dimora.nome}</p>
      <button
        type="button"
        className="ItinerarioDimoraCard__removeBtn"
        onClick={props.onRemove}
      >
        <RemoveSvg className="ItinerarioDimoraCard__removeBtn__icon" />
      </button>
    </div>
  );
}

export default ItinerarioDimoraCard;
