import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton/BackButton";
import ImagePicker from "../../components/ImagePicker/ImagePicker";
import SearchBar from "../../components/SearchBar/SearchBar";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import { ReactComponent as DeleteSvg } from "../../assets/icons/delete.svg";
import "./ItinerarioDetailsScreen.scss";
import Api from "../../data/api";
import Dimora from "../../data/models/dimora";
import Spinner from "../../components/Spinner/Spinner";

export enum ItinerarioDetailsAction {
  Add,
  Edit,
}

interface IItinerarioDetailsScreenProps {
  action: ItinerarioDetailsAction;
}

function ItinerarioDetailsScreen(props: IItinerarioDetailsScreenProps) {
  const [image, setImage] = useState<FileList | null>();
  const [searchedDimora, setSearchedDimora] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchableDimore, setSearchableDimore] = useState<Dimora[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const abortController = new AbortController();

    Api.fetchAllDimore({ signal: abortController.signal }).then(
      (dimoreData) => {
        const dimore = dimoreData.map((data) => new Dimora(data));
        setSearchableDimore(dimore);
        console.log(dimore);
      }
    );

    return () => {
      // abort request if component unmounts
      setIsLoading(false);
      abortController.abort();
    };
  }, []);

  return (
    <main className="ItinerarioDetails page">
      <div className="ItinerarioDetails__titleSection">
        <BackButton />
        <h1 className="title">
          {props.action === ItinerarioDetailsAction.Add
            ? "Aggiungi Itinerario"
            : "Modifica Itinerario"}
        </h1>
      </div>
      {isLoading ? (
        <>
          <div className="ItinerarioDetails__content">
            <div className="ItinerarioDetails__content__top">
              <div className="ItinerarioDetails__content__top__left">
                <label className="label ItinerarioDetails__content__top__label">
                  Nome
                </label>
                <input
                  className="input"
                  type="text"
                  placeholder="Inserisci un nome"
                />
              </div>
              <div className="ItinerarioDetails__content__top__right">
                <div className="label ItinerarioDetails__content__top__imagePicker">
                  <label className="label ItinerarioDetails__content__top__label">
                    Immagine Mappa
                  </label>
                  <ImagePicker onImagesChange={setImage} />
                </div>
                <div className="ItinerarioDetails__content__top__imageWrapper">
                  {image && (
                    <img
                      src={URL.createObjectURL(image[0])}
                      alt="percorso"
                      className="ItinerarioDetails__content__top__imageWrapper__image"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="ItinerarioDetails__content__waypoints">
              <h2 className="title">Tappe Percorso</h2>
              <div className="ItinerarioDetails__content__waypoints__container">
                <div className="input ItinerarioDetails__content__waypoints__list"></div>
                <div className="ItinerarioDetails__content__waypoints__search">
                  <SearchBar
                    value={searchedDimora}
                    onChange={setSearchedDimora}
                    onSearch={() => {}}
                  />
                  <div className="input ItinerarioDetails__content__waypoints__search__list"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="ItinerarioDetails__actions">
            {props.action === ItinerarioDetailsAction.Edit && (
              <button className="btn ItinerarioDetails__actions__delete">
                <DeleteSvg className="btn__icon" />
                <span>Elimina</span>
              </button>
            )}
            <button className="btn ItinerarioDetails__actions__save">
              <CheckSvg className="btn__icon" />
              <span>Salva</span>
            </button>
          </div>
        </>
      ) : (
        <div className="centeredContent">
          <Spinner />
        </div>
      )}
    </main>
  );
}

export default ItinerarioDetailsScreen;
