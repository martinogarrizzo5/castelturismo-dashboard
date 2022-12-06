import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Api from "../../data/api";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import "./CreditsScreen.scss";

function CreditsScreen() {
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [credits, setCredits] = useState<ICredits | null>(null);

  useEffect(() => {
    setIsLoadingContent(true);
    const abortController = new AbortController();

    Api.fetchCredits({ signal: abortController.signal })
      .then((credits) => {
        setCredits(credits);
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

  const onCreditsChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCredits = ev.target.value;
    setCredits(
      (prevVal) => ({ ...prevVal, descrizione: newCredits } as ICredits)
    );
  };

  return (
    <main className="page Credits">
      <div className="Credits__titleSection">
        <h1 className="title Credits__titleSection__title">Credits</h1>
      </div>
      {!isLoadingContent && credits ? (
        <div className="Credits__contentSection">
          <textarea
            className="textarea Credits__contentSection__textarea"
            id="credits"
            placeholder="Inserisci gli autori della applicazione di Castelfranco Veneto"
            value={credits.descrizione}
            onChange={onCreditsChange}
          ></textarea>
          <div className="Credits__bottomActions">
            <p className="Credits__bottomActions__credits">
              Made With ❤️ By Martin Meneghetti
            </p>
            <button className="btn Credits__bottomActions__save">
              <CheckSvg className="btn__icon" />
              <p>Salva</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="centeredContent Credits__spinner">
          <Spinner />
        </div>
      )}
    </main>
  );
}

export default CreditsScreen;
