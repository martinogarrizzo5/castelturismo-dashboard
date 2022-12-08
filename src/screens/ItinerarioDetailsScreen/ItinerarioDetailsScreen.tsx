import React from "react";
import "./ItinerarioDetailsScreen.scss";

export enum ItinerarioDetailsAction {
  Add,
  Edit,
}

interface IItinerarioDetailsScreenProps {
  action: ItinerarioDetailsAction;
}

function ItinerarioDetailsScreen(props: IItinerarioDetailsScreenProps) {
  return (
    <main className="ItinerarioDetails page">
      <div className="ItinerarioDetails__titleSection">
        <h1 className="title">
          {props.action === ItinerarioDetailsAction.Add
            ? "Aggiungi Itinerario"
            : "Modifica Itinerario"}
        </h1>
      </div>
    </main>
  );
}

export default ItinerarioDetailsScreen;
