import { useNavigate } from "react-router-dom";
import TextUtils, { LanguageCode } from "../../utils/textUtils";
import "./IntroPercorsoCard.scss";

interface IntroPercorsoCardProps {
  introPercorso: IIntroPercorso;
}

function IntroPercorsoCard(props: IntroPercorsoCardProps) {
  const navigate = useNavigate();

  const cardClick = (percorso: IIntroPercorso) => {
    navigate(`/app/itinerari/${percorso.id}`);
  };

  return (
    <figure
      className="IntroPercorsoCard"
      onClick={() => cardClick(props.introPercorso)}
    >
      <div className="IntroPercorsoCard__image-wrapper">
        <img
          src={props.introPercorso.path}
          alt="mappa percorso"
          className="IntroPercorsoCard__image"
        />
      </div>
      <figcaption className="IntroPercorsoCard__caption">
        {TextUtils.getText(props.introPercorso.descrizione, LanguageCode.it)}
      </figcaption>
    </figure>
  );
}

export default IntroPercorsoCard;
