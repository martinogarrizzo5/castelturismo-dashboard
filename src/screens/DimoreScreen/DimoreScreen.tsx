import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ReactComponent as PinSvg } from "../../assets/icons/pin.svg";
import { ReactComponent as AddSvg } from "../../assets/icons/add.svg";
import "./DimoreScreen.scss";
import SearchBar from "../../components/SearchBar/SearchBar";
import Api from "../../data/api";
import DimoraCard from "../../components/DimoraCard/DimoraCard";
import Dimora from "../../data/models/dimora";
import Spinner from "../../components/Spinner/Spinner";

function DimoreScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setSearchParams] = useSearchParams();

  const [searchedDimora, setSearchedDimora] = useState<string>("");
  const [dimore, setDimore] = useState<Dimora[] | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(true);

  const zones = [
    { name: "Tra le Mura", id: 1 },
    { name: "Corso XXIX Aprile", id: 2 },
    { name: "Piazza Giorgione", id: 3 },
    { name: "Borgo Treviso", id: 4 },
  ];

  useEffect(() => {
    setIsLoadingContent(true);
    const abortController = new AbortController();
    const zonaId = params.get("zona") || "";

    if (zonaId) {
      Api.fetchDimoreByZona({ zonaId: +zonaId })
        .then((zona) => handleDimoreData(zona.dimore))
        .catch((err) => handleRequestError(err));
    } else {
      Api.fetchAllDimore({ signal: abortController.signal })
        .then((dimoreData) => handleDimoreData(dimoreData))
        .catch((err) => handleRequestError(err));
    }

    const handleDimoreData = (dimoreData: IDimora[]) => {
      const dimore = dimoreData.map((data) => new Dimora(data));
      setDimore(dimore);
      setIsLoadingContent(false);
    };

    const handleRequestError = (err: any) => {
      if (err.code && err.code === "ERR_CANCELED") {
        console.log("canceled request");
      }
    };

    return () => {
      // abort request if component unmounts
      setIsLoadingContent(false);
      abortController.abort();
    };
  }, [location, params]);

  const onSearchedValueChanged = (val: string) => {
    setSearchedDimora(val);
  };

  const onSearch = () => {
    setIsLoadingContent(true);
    // TODO: implement search
  };

  const onZonaFiltering = (id: number) => {
    setSearchParams({ zona: id.toString() });
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
            onClick={() => onZonaFiltering(zone.id)}
          >
            <PinSvg className="Dimore__zone__icon" />
            <span className="Dimore__zone__name">{zone.name}</span>
          </button>
        ))}
      </div>
      <h1 className="Dimore__title title">Dimore</h1>
      <div className="Dimore__actions">
        <SearchBar
          value={searchedDimora}
          onChange={onSearchedValueChanged}
          onSearch={onSearch}
        />
        <button className="btn Dimore__add-button" type="button">
          <AddSvg className="Dimore__add-button__icon" />
          <span>Aggiungi</span>
        </button>
      </div>
      {dimore !== null && !isLoadingContent ? (
        <div className="Dimore__dimore">
          {dimore.map((dimora) => (
            <DimoraCard dimora={dimora} key={`dimora-${dimora.id}`} />
          ))}
        </div>
      ) : (
        <div className="centeredContent Dimore__dimore__spinner">
          <Spinner />
        </div>
      )}
    </main>
  );
}

export default DimoreScreen;
