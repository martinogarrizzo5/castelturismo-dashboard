import React from "react";
import Dimora from "../../data/models/dimora";
import "./DimoraCard.scss";

interface IDimoraCardProps {
  dimora: Dimora;
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

  return (
    <figure className="DimoraCard">
      <img
        src={props.dimora.coverPath}
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
