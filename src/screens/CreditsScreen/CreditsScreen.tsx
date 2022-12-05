import React from "react";
import "./CreditsScreen.scss";

function CreditsScreen() {
  return (
    <main className="page Credits">
      <div className="Credits__titleSection">
        <h1 className="title Credits__titleSection__title">Credits</h1>
      </div>
      <textarea
        className="textarea Credits__textarea"
        id="credits"
        placeholder="Inserisci gli autori della applicazione di Castelfranco Veneto"
      ></textarea>
      <p className="Credits__credits">Made With ❤️ By Martin Meneghetti</p>
      <button className="btn Credits__save">
        <p>Salva</p>
      </button>
    </main>
  );
}

export default CreditsScreen;
