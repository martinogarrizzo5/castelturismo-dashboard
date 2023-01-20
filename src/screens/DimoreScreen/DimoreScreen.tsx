import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ReactComponent as PinSvg } from "../../assets/icons/pin.svg";
import { ReactComponent as AddSvg } from "../../assets/icons/add.svg";
import "./DimoreScreen.scss";
import SearchBar from "../../components/SearchBar/SearchBar";
import Api from "../../data/api";
import DimoraCard from "../../components/DimoraCard/DimoraCard";
import Spinner from "../../components/Spinner/Spinner";
import classNames from "classnames";

function DimoreScreen() {
  const navigate = useNavigate();
  const [params, setSearchParams] = useSearchParams();
  const zonaId = params.get("zona");

  const [searchedDimora, setSearchedDimora] = useState<string>("");
  const [dimore, setDimore] = useState<IIntroDimora[] | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState<boolean>(false);

  const zones = [
    { name: "Corso XXIX Aprile", id: 1 },
    { name: "Tra le Mura", id: 2 },
    { name: "Piazza Giorgione", id: 3 },
    { name: "Borgo Treviso", id: 4 },
  ];

  useEffect(() => {
    setIsLoadingContent(true);
    const abortController = new AbortController();
    const zonaId = params.get("zona") || "";

    Api.fetchIntroDimore({
      zonaId: +zonaId,
      name: searchedDimora,
      signal: abortController.signal,
    })
      .then((dimore) => handleDimoreData(dimore))
      .catch((err) => handleRequestError(err));

    const handleDimoreData = (dimoreData: IIntroDimora[]) => {
      setDimore(dimoreData);
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
  }, [params]);

  const onSearchedValueChanged = (val: string) => {
    setSearchedDimora(val);
  };

  const onSearch = async () => {
    setIsLoadingContent(true);
    const zonaId = params.get("zona");
    const dimoreData = await Api.fetchIntroDimore({
      name: searchedDimora,
      zonaId: zonaId ? +zonaId : null,
    });
    setIsLoadingContent(false);
    setDimore(dimoreData);
  };

  const onDeleteSearch = async () => {
    const zonaId = params.get("zona");
    setIsLoadingContent(true);
    const dimoreData = await Api.fetchIntroDimore({
      name: "",
      zonaId: zonaId ? +zonaId : null,
    });
    setIsLoadingContent(false);
    setDimore(dimoreData);
  };

  const filterByZona = (id: number) => {
    if (params.get("zona") === id.toString()) return;
    setSearchParams({ zona: id.toString() });
  };

  const removeZonaFilter = () => {
    if (!params.get("zona")) return;
    setSearchParams({});
  };

  const onCardClick = (dimora: IIntroDimora) => {
    navigate(`/app/dimore/${dimora.id}`);
  };

  const onAddButtonClick = () => {
    navigate("/app/dimore/new");
  };

  const createDimoreSection = (tipology: string, dimore: Dimora[]) => {
    return (
      <div className="Dimore__section">
        <h2 className="Dimore__section__title">{tipology}</h2>
        <div className="Dimore__section__dimore">
          {dimore.map((dimora) => (
            <DimoraCard
              dimora={dimora}
              key={`dimora-${dimora.id}`}
              onClick={() => onCardClick(dimora)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="Dimore page">
      <h2 className="Dimore__title title">Zone</h2>
      <div className="Dimore__zones">
        <button
          className={classNames(
            "btn Dimore__zone",
            !zonaId && "Dimore__zone--active"
          )}
          type="button"
          onClick={removeZonaFilter}
        >
          <PinSvg className="Dimore__zone__icon" />
          <span className="Dimore__zone__name">Tutte</span>
        </button>
        {zones.map((zone) => (
          <button
            className={classNames(
              "btn Dimore__zone",
              zonaId != null && zone.id === +zonaId && "Dimore__zone--active"
            )}
            key={`zone-${zone.id}`}
            type="button"
            onClick={() => filterByZona(zone.id)}
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
          onDeleteSearch={onDeleteSearch}
        />
        <button
          className="btn Dimore__add-button"
          type="button"
          onClick={onAddButtonClick}
        >
          <AddSvg className="Dimore__add-button__icon" />
          <span>Aggiungi</span>
        </button>
      </div>
      {dimore !== null && !isLoadingContent ? (
        <div className="Dimore__dimore">
          {dimore.map((dimora) => (
            <DimoraCard
              dimora={dimora}
              key={`dimora-${dimora.id}`}
              onClick={() => onCardClick(dimora)}
            />
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
