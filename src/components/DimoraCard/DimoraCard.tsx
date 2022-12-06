import React from "react";
import Dimora from "../../data/models/dimora";
import "./DimoraCard.scss";

interface IDimoraCardProps {
  dimora: Dimora;
  onClick: () => void;
}

function DimoraCard(props: IDimoraCardProps) {
  const getShortName = () => {
    const shortNameSize = 40;
    const name = props.dimora.nome;

    if (name.length <= shortNameSize) {
      return name;
    }
    return name.substring(0, shortNameSize) + "...";
  };

  let imageToShow = props.dimora.coverPath;
  // TODO: remove this when there will be better images for hotels and bars
  if (props.dimora.tipologia === "Bar") {
    imageToShow = props.dimora.foto[1].path;
  }

  return (
    <figure className="DimoraCard" onClick={props.onClick}>
      <img
        src={imageToShow}
        alt={props.dimora.nome}
        className="DimoraCard__image"
        loading="lazy"
      />
      <figcaption className="DimoraCard__caption">
        <p className="DimoraCard__caption__text">{getShortName()}</p>
      </figcaption>
    </figure>
  );
}

export default DimoraCard;
