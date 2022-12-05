import TextUtils, { LanguageCode } from "../../utils/textUtils";
import "./IntroPercorsoCard.scss";

interface IntroPercorsoCardProps {
  introPercorso: IIntroPercorso;
}

function IntroPercorsoCard(props: IntroPercorsoCardProps) {
  return (
    <figure className="IntroPercorsoCard">
      <img
        src={props.introPercorso.path}
        alt="mappa percorso"
        className="IntroPercorsoCard__image"
      />
      <figcaption className="IntroPercorsoCard__caption">
        {TextUtils.getText(props.introPercorso.descrizione, LanguageCode.it)}
      </figcaption>
    </figure>
  );
}

export default IntroPercorsoCard;
