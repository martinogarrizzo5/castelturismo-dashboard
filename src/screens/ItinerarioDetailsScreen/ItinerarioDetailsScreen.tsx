import React, { useState, useEffect } from "react";
import BackButton from "../../components/BackButton/BackButton";
import ImagePicker from "../../components/ImagePicker/ImagePicker";
import SearchBar from "../../components/SearchBar/SearchBar";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import { ReactComponent as DeleteSvg } from "../../assets/icons/delete.svg";
import { ReactComponent as AddSvg } from "../../assets/icons/add.svg";
import "./ItinerarioDetailsScreen.scss";
import { dropDownStyles } from "../../scss/dropDownStyles/dropDownStyle";
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
import Select from "react-select";
import TextUtils from "../../utils/textUtils";
import { AxiosError } from "axios";
import {
  NotificationType,
  useNotification,
} from "../../store/notificationStore";
import EmptyImg from "../../assets/images/empty.png";

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

  const [image, setImage] = useState<string | FileList | null>(null);
  const [searchedDimora, setSearchedDimora] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDimore, setAllDimore] = useState<Dimora[] | null>(null);
  const [searchableDimore, setSearchableDimore] = useState<Dimora[] | null>(
    null
  );
  const [itinerarioDimore, setItinerarioDimore] = useState<Dimora[] | null>(
    null
  );
  const [names, setNames] = useState<Map<string, string> | null>(null);

  const [oldItinerarioDimore, setOldItinerarioDimore] = useState<
    Dimora[] | null
  >(null);
  const [oldNames, setOldNames] = useState<Map<string, string> | null>(null);

  const dialogState = useDialog();
  const notificationState = useNotification();
  const [languageOptions, setLanguagesOptions] = useState<ILingua[] | null>(
    null
  );
  const [language, setLanguage] = useState<ILingua | null>(null);
  const [isSaving, setSaving] = useState<boolean>(false);

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
    try {
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
        Api.fetchLanguages({ signal: abortController.signal }),
      ]);

      const [allDimoreData, percorso, languages] = result;
      const allDimore = allDimoreData.map((data) => new Dimora(data));
      const itinerarioDimore = percorso.dimore.map((data) => new Dimora(data));

      setIsLoading(false);
      setSearchableDimore(allDimore);
      setItinerarioDimore(itinerarioDimore);
      setImage(percorso.imageUrl);
      setAllDimore(allDimore);
      setLanguagesOptions(languages);
      setLanguage(languages[0]);
      const names = TextUtils.getTranslations(percorso.descrizione);
      setNames(names);

      setOldNames(new Map(names));
      setOldItinerarioDimore([...itinerarioDimore]);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 404) {
        navigate("/app/itinerari/new", { replace: true });
      }
    }
  };

  const initAddPage = async (abortController: AbortController) => {
    setIsLoading(true);
    const [allDimoreData, languages] = await Promise.all([
      Api.fetchAllDimore({
        signal: abortController.signal,
      }),
      Api.fetchLanguages({ signal: abortController.signal }),
    ]);
    const allDimore = allDimoreData.map((data) => new Dimora(data));
    setIsLoading(false);
    setSearchableDimore(allDimore);
    setItinerarioDimore([]);
    setNames(new Map());
    setAllDimore(allDimore);
    setLanguagesOptions(languages);
    setLanguage(languages[0]);

    setOldNames(new Map());
    setOldItinerarioDimore([]);
  };

  const showDeleteAlertDialog = () => {
    dialogState.setDialog({
      title: "Sei sicuro di voler eliminare l'itinerario?",
      subTitle: "Una volta cancellato non potrà essere recuperato",
      mainActionTitle: "Annulla",
      sideActionTitle: "Conferma",
      onMainActionClick: dialogState.dismissDialog,
      onSideActionClick: deleteItinerario,
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
      <div className="centeredContent ItinerarioDetails__empty">
        <img
          src={EmptyImg}
          alt="empty list"
          className="ItinerarioDetails__empty__img"
        />
        <h3 className="subTitle">{title}</h3>
      </div>
    );
  };

  const getTranslatedName = () => {
    if (!language || !names) return "";
    const translation = names.get(language.codice);
    if (!translation) return "";

    return translation;
  };

  const onNameChange = (text: string) => {
    const newNames = new Map(names);
    newNames.set(language!.codice, text);
    setNames(newNames);
  };

  const areNamesChanged = () => {
    if (!oldNames || !names) return false;

    for (const [key, value] of names) {
      if (oldNames.get(key) === undefined) {
        if (value !== "") return true;
      } else if (oldNames.get(key) !== value) {
        return true;
      }
    }

    return false;
  };

  const areItinerarioDimoreChanged = () => {
    if (!oldItinerarioDimore || !itinerarioDimore) return false;
    if (oldItinerarioDimore.length !== itinerarioDimore.length) return true;

    let isChanged: boolean = false;
    itinerarioDimore.forEach((dimora, index) => {
      if (
        oldItinerarioDimore.length > index &&
        oldItinerarioDimore[index].id !== dimora.id
      )
        isChanged = true;
    });

    return isChanged;
  };

  const addItinerario = async () => {
    if (names == null || image == null) return;

    let dimoreIds: number[] = [];
    if (itinerarioDimore) {
      dimoreIds = itinerarioDimore.map((dimora) => dimora.id);
    }

    const formData = new FormData();
    formData.set("languageCodes", JSON.stringify([...names.keys()]));
    formData.set("descriptions", JSON.stringify([...names.values()]));
    formData.set("timeInHours", JSON.stringify(0));
    formData.set("dimoreIds", JSON.stringify(dimoreIds));
    formData.set("image", image[0]);

    try {
      setSaving(true);
      const response = await Api.addItinerario({ data: formData });
      notificationState.showNotification(
        response.data.message,
        NotificationType.Success
      );
      setSaving(false);
      navigate(`/app/itinerari/${response.data["id"]}`, { replace: true });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        notificationState.showNotification(
          (error.response.data as any).error,
          NotificationType.Error
        );
      }
      setSaving(false);
    }
  };

  const updateItinerario = async () => {
    const formData = new FormData();
    if (id) {
      formData.set("id", JSON.stringify(id));
    }
    if (names) {
      formData.set("languageCodes", JSON.stringify([...names.keys()]));
      formData.set("descriptions", JSON.stringify([...names.values()]));
    }
    formData.set("timeInHours", JSON.stringify(0));

    let dimoreIds: number[] = [];
    if (itinerarioDimore) {
      dimoreIds = itinerarioDimore.map((dimora) => dimora.id);
    }
    formData.set("dimoreIds", JSON.stringify(dimoreIds));

    if (image) {
      formData.set("image", image[0]);
    }
    try {
      setSaving(true);
      const res = await Api.updateItinerario({ data: formData });
      setSaving(false);
      notificationState.showNotification(
        res.data.message,
        NotificationType.Success
      );
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        notificationState.showNotification(
          (error.response.data as any).error,
          NotificationType.Error
        );
      }
      setSaving(false);
    }
  };

  const deleteItinerario = async () => {
    if (!id) return;

    try {
      const response = await Api.deleteItinerario({ id: +id });
      dialogState.dismissDialog();
      notificationState.showNotification(
        response.data.message,
        NotificationType.Success
      );
      navigate("/app/itinerari", { replace: true });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        notificationState.showNotification(
          (error.response.data as any).error,
          NotificationType.Error
        );
      }
    }
  };

  const canShowPage = !isLoading && itinerarioDimore && languageOptions;

  const addCondition =
    props.pageType === PageType.Add &&
    areNamesChanged() &&
    areItinerarioDimoreChanged();
  const updateCondition =
    props.pageType === PageType.Edit &&
    (areNamesChanged() || areItinerarioDimoreChanged());

  const canSave =
    names &&
    image &&
    itinerarioDimore?.length &&
    (addCondition || updateCondition);
  const saveItinerarioAction =
    props.pageType === PageType.Add ? addItinerario : updateItinerario;

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
                <div className="ItinerarioDetails__content__top__left__section">
                  <label className="label ItinerarioDetails__content__top__label">
                    Nome
                  </label>
                  <Select
                    options={languageOptions}
                    value={language}
                    onChange={setLanguage}
                    getOptionLabel={(option) => option.nome}
                    getOptionValue={(option) => option.id.toString()}
                    isSearchable={false}
                    unstyled
                    classNames={{
                      ...dropDownStyles,
                      container: (state) =>
                        "DimoraDetails__description__languageDropdown",
                      control: (state) =>
                        "btn DimoraDetails__description__languageDropdown__control",
                    }}
                  />
                </div>
                <input
                  className="input"
                  type="text"
                  placeholder="Inserisci un nome"
                  value={getTranslatedName()}
                  onChange={(e) => onNameChange(e.target.value)}
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
                onClick={showDeleteAlertDialog}
              >
                <DeleteSvg className="btn__icon" />
                <span>Elimina</span>
              </button>
            )}
            <button
              className={classNames(
                "btn ItinerarioDetails__actions__save",
                !canSave && "btn--disabled"
              )}
              onClick={canSave && !isSaving ? saveItinerarioAction : () => {}}
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
