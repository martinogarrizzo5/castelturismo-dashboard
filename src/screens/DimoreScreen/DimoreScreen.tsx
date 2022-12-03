import React, { useState } from "react";
import { ReactComponent as PinSvg } from "../../assets/icons/pin.svg";
import { ReactComponent as AddSvg } from "../../assets/icons/add.svg";
import "./DimoreScreen.scss";
import SearchBar from "../../components/SearchBar/SearchBar";

function DimoreScreen() {
  const [searchedDimora, setSearchedDimora] = useState<string>("");

  const zones = [
    { name: "Tra le Mura", id: 1 },
    { name: "Corso XXIX Aprile", id: 2 },
    { name: "Piazza Giorgione", id: 3 },
    { name: "Borgo Treviso", id: 4 },
  ];

  const onSearchedValueChanged = (val: string) => {
    setSearchedDimora(val);
  };

  return (
    <main className="Dimore page">
      <h2 className="Dimore__title title">Zone</h2>
      <div className="Dimore__zones">
        {zones.map((zone) => (
          <button
            className="btn Dimore__zone"
            key={`zone-${zone.id}`}
            type="button"
          >
            <PinSvg className="Dimore__zone__icon" />
            <span className="Dimore__zone__name">{zone.name}</span>
          </button>
        ))}
      </div>
      <h1 className="Dimore__title title">Dimore</h1>
      <div className="Dimore__actions">
        <SearchBar value={searchedDimora} onChange={onSearchedValueChanged} />
        <button className="btn Dimore__add-button" type="button">
          <AddSvg className="Dimore__add-button__icon" />
          <span>Aggiungi</span>
        </button>
      </div>
    </main>
  );
}

export default DimoreScreen;
