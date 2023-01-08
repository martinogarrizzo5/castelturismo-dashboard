import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner/Spinner";
import Api from "../../data/api";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import {
  useNotification,
  NotificationType,
} from "../../store/notificationStore";
import "./CreditsScreen.scss";
import classNames from "classnames";

function CreditsScreen() {
  const notificationState = useNotification();
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [actualCredits, setActualCredits] = useState<ICredits | null>(null);
  const [credits, setCredits] = useState<ICredits | null>(null);

  useEffect(() => {
    setIsLoadingContent(true);
    const abortController = new AbortController();

    Api.fetchCredits({ signal: abortController.signal })
      .then((credits) => {
        setActualCredits(credits);
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

  const onCreditsSave = async () => {
    if (!credits) return;
    // TODO: handle error case
    setIsSaving(true);
    const response = await Api.updateCredits({
      description: credits.descrizione,
    });
    const message = response.message;
    setIsSaving(false);
    setActualCredits(credits);
    notificationState.showNotification(message, NotificationType.Success);
  };

  const saveActionEnabled = actualCredits?.descrizione !== credits?.descrizione;
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
            <button
              className={classNames(
                "btn Credits__bottomActions__save",
                !saveActionEnabled && "btn--disabled"
              )}
              onClick={
                saveActionEnabled && !isSaving ? onCreditsSave : () => {}
              }
            >
              {isSaving ? (
                <div className="centeredContent">
                  <Spinner className="spinner--sm spinner--white" />
                </div>
              ) : (
                <>
                  <CheckSvg className="btn__icon" />
                  <p>Salva</p>
                </>
              )}
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
