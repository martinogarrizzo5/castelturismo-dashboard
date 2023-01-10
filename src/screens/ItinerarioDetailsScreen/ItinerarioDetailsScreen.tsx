import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton/BackButton";
import ImagePicker from "../../components/ImagePicker/ImagePicker";
import SearchBar from "../../components/SearchBar/SearchBar";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import { ReactComponent as DeleteSvg } from "../../assets/icons/delete.svg";
import { ReactComponent as AddSvg } from "../../assets/icons/add.svg";
import "./ItinerarioDetailsScreen.scss";
import Api from "../../data/api";
import Dimora from "../../data/models/dimora";
import Spinner from "../../components/Spinner/Spinner";
import { useDialog } from "../../store/dialogStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import ItinerarioDimoraCard from "../../components/ItinerarioDimoraCard/ItinerarioDimoraCard";
import classNames from "classnames";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export enum PageType {
  Add,
  Edit,
}

interface IItinerarioDetailsScreenProps {
  pageType: PageType;
}

function ItinerarioDetailsScreen(props: IItinerarioDetailsScreenProps) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState<string | FileList | null>();
  const [searchedDimora, setSearchedDimora] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDimore, setAllDimore] = useState<Dimora[] | null>(null);
  const [searchableDimore, setSearchableDimore] = useState<Dimora[] | null>(
    null
  );
  const [itinerarioDimore, setItinerarioDimore] = useState<Dimora[] | null>(
    null
  );
  const [itinerarioName, setItinerarioName] = useState<string | null>(null);
  const dialogState = useDialog();

  useEffect(() => {
    const abortController = new AbortController();

    if (props.pageType === PageType.Add) {
      initAddPage(abortController);
    } else if (props.pageType === PageType.Edit) {
      initEditPage(abortController);
    }
    return () => {
      // abort request if component unmounts
      setIsLoading(false);
      abortController.abort();
    };
  }, [location, id]);

  const initEditPage = async (abortController: AbortController) => {
    const itinerarioId = parseInt(id!, 10);
    if (isNaN(itinerarioId))
      return navigate("/app/itinerari/new", { replace: true });

    setIsLoading(true);
    const result = await Promise.all([
      Api.fetchAllDimore({ signal: abortController.signal }),
      Api.fetchPercorsoById({
        signal: abortController.signal,
        id: itinerarioId,
      }),
    ]);

    const [allDimoreData, percorso] = result;
    const allDimore = allDimoreData.map((data) => new Dimora(data));
    const itinerarioDimore = percorso.dimore.map((data) => new Dimora(data));

    setIsLoading(false);
    setSearchableDimore(allDimore);
    setItinerarioDimore(itinerarioDimore);
    setItinerarioName(percorso.descrizione);
    setImage(percorso.imageUrl);
    setAllDimore(allDimore);
  };

  const initAddPage = async (abortController: AbortController) => {
    setIsLoading(true);
    const allDimoreData = await Api.fetchAllDimore({
      signal: abortController.signal,
    });
    const allDimore = allDimoreData.map((data) => new Dimora(data));
    setIsLoading(false);
    setSearchableDimore(allDimore);
    setItinerarioDimore([]);
    setItinerarioName("");
    setAllDimore(allDimore);
  };

  const showAlertDialog = () => {
    dialogState.setDialog({
      title: "Sei sicuro di voler eliminare l'itinerario?",
      subTitle: "Una volta cancellato non potrà essere recuperato",
      mainActionTitle: "Annulla",
      sideActionTitle: "Conferma",
      onMainActionClick: dialogState.dismissDialog,
    });
    dialogState.showDialog();
  };

  const searchableDimoreCard = (dimora: Dimora) => {
    const isAlreadySelected =
      itinerarioDimore &&
      itinerarioDimore.findIndex((el) => el.id === dimora.id) !== -1;

    return (
      <div
        key={`searchable-${dimora.id}`}
        className="ItinerarioDetails__searchableDimora"
      >
        <img
          src={dimora.coverPath}
          alt="dimora"
          className="ItinerarioDetails__searchableDimora__img"
        />
        <p className="ItinerarioDetails__searchableDimora__name">
          {dimora.nome}
        </p>
        <button
          type="button"
          className={classNames(
            "btn ItinerarioDetails__searchableDimora__addBtn",
            isAlreadySelected && "btn--disabled"
          )}
          onClick={
            isAlreadySelected ? () => {} : () => addDimoraToItinerario(dimora)
          }
        >
          <AddSvg className="btn__icon ItinerarioDetails__searchableDimora__addBtn__icon" />
        </button>
      </div>
    );
  };

  const addDimoraToItinerario = (dimora: Dimora) => {
    if (itinerarioDimore) {
      setItinerarioDimore((prevDimore) => [...prevDimore!, dimora]);
    }
  };

  // reorder the items in list when finished dragging
  const onDragEnd = (result: DropResult) => {
    console.log(result);

    const { source, destination } = result;
    if (!destination || !itinerarioDimore) {
      return;
    }
    if (source.index === destination.index) {
      return;
    }

    // swap the two dimore
    const newItems = [...itinerarioDimore];
    const [removedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, removedItem);

    setItinerarioDimore(newItems);
  };

  const onRemove = (index: number) => {
    if (!itinerarioDimore) return;
    const newItems = [...itinerarioDimore];
    newItems.splice(index, 1);

    setItinerarioDimore(newItems);
  };

  const onSearch = (text: string) => {
    if (!allDimore) return [];

    const dimore = allDimore!.filter((el) =>
      el.nome.toLowerCase().includes(text.toLowerCase())
    );
    setSearchableDimore(dimore);
  };

  const noItemAvailableDiv = (title: string) => {
    return (
      <div className="centeredContent">
        <h3 className="subTitle">{title}</h3>
      </div>
    );
  };

  const canShowPage = !isLoading && itinerarioDimore;
  return (
    <main className="ItinerarioDetails page">
      <div className="ItinerarioDetails__titleSection">
        <BackButton />
        <h1 className="title">
          {props.pageType === PageType.Add
            ? "Aggiungi Itinerario"
            : "Modifica Itinerario"}
        </h1>
      </div>
      {canShowPage ? (
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
                  defaultValue={itinerarioName !== null ? itinerarioName : ""}
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
                  {image instanceof FileList && (
                    <img
                      src={URL.createObjectURL(image[0])}
                      alt="percorso"
                      className="ItinerarioDetails__content__top__imageWrapper__image"
                    />
                  )}
                  {typeof image === "string" && (
                    <img
                      src={image}
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
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div
                        className="input ItinerarioDetails__content__waypoints__list"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {itinerarioDimore.length === 0 &&
                          noItemAvailableDiv("Nessuna dimora selezionata")}
                        {itinerarioDimore.map((dimora, i) => (
                          <Draggable
                            draggableId={`id-dimora-draggable-${dimora.id}`}
                            key={`key-dimora-draggable-${dimora.id}`}
                            index={i}
                          >
                            {(provided, snapshot) => (
                              <div
                                className={classNames(
                                  "ItinerarioDetails__content__waypoints__list__item-wrapper",
                                  snapshot.isDragging &&
                                    "ItinerarioDetails__content__waypoints__list__item-wrapper--dragging"
                                )}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ItinerarioDimoraCard
                                  dimora={dimora}
                                  onRemove={() => onRemove(i)}
                                  position={i + 1}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <div className="ItinerarioDetails__content__waypoints__search">
                  <SearchBar
                    value={searchedDimora}
                    onChange={setSearchedDimora}
                    onSearch={onSearch}
                    onDeleteSearch={() => setSearchableDimore(allDimore)}
                  />
                  <div className="input ItinerarioDetails__content__waypoints__search__list">
                    {searchableDimore !== null ? (
                      searchableDimore.map((dimora) =>
                        searchableDimoreCard(dimora)
                      )
                    ) : (
                      <div className="centeredContent">
                        <Spinner />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ItinerarioDetails__actions">
            {props.pageType === PageType.Edit && (
              <button
                className="btn ItinerarioDetails__actions__delete"
                onClick={showAlertDialog}
              >
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
