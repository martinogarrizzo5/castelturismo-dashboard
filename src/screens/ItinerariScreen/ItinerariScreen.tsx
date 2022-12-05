import React, { useEffect, useState } from "react";
import { ReactComponent as AddSvg } from "../../assets/icons/add.svg";
import IntroPercorsoCard from "../../components/IntroPercorsoCard/IntroPercorsoCard";
import Spinner from "../../components/Spinner/Spinner";
import Api from "../../data/api";
import "./ItinerariScreen.scss";

function ItinerariScreen() {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [introPercorsi, setIntroPercorsi] = useState<IIntroPercorso[] | null>(
    null
  );

  useEffect(() => {
    setIsLoadingContent(true);
    const abortController = new AbortController();

    Api.fetchIntroPercorsi({ signal: abortController.signal })
      .then((introPercorsi) => {
        setIntroPercorsi(introPercorsi);
        setIsLoadingContent(false);
      })
      .catch((err) => {
        if (err.code && err.code === "ERR_CANCELED") {
          console.log("canceled request");
        }
      });

    return () => {
      // abort request if component unmounts
      setIsLoadingContent(false);
      abortController.abort();
    };
  }, []);

  return (
    <main className="Itinerari page">
      <div className="Itinerari__titleSection">
        <h1 className="Itinerari__title title">Itinerari</h1>
        <button type="button" className="Itinerari__addButton btn">
          <AddSvg className="Itinerari__addButton__icon" />
          <span className="Itinerari__add-button__text">Aggiungi</span>
        </button>
      </div>

      {!isLoadingContent && introPercorsi ? (
        <div className="Itinerari__introPercorsi">
          {introPercorsi.map((introPercorso) => (
            <IntroPercorsoCard
              introPercorso={introPercorso}
              key={`introPercorso-${introPercorso.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="centeredContent Itinerari__spinner">
          <Spinner />
        </div>
      )}
    </main>
  );
}

export default ItinerariScreen;
