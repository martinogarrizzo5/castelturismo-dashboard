import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { ReactComponent as CheckSvg } from "../../assets/icons/check.svg";
import { ReactComponent as DeleteSvg } from "../../assets/icons/delete.svg";
import { ReactComponent as CloseSvg } from "../../assets/icons/close.svg";
import BackButton from "../../components/BackButton/BackButton";
import ImagePicker from "../../components/ImagePicker/ImagePicker";
import { dropDownStyles } from "../../scss/dropDownStyles/dropDownStyle";
import "../../scss/dropDownStyles/dropDownStyle.scss";
import "./DimoraDetailsScreen.scss";
import Api from "../../data/api";
import Dimora from "../../data/models/dimora";
import Spinner from "../../components/Spinner/Spinner";
import { useDialog } from "../../store/dialogStore";

export enum DimoraDetailsAction {
  Add,
  Edit,
}

interface IDimoraDetailsScreenProps {
  action: DimoraDetailsAction;
}

function DimoraDetailsScreen(props: IDimoraDetailsScreenProps) {
  const languages = [
    { label: "Italiano", value: 1 },
    { label: "Inglese", value: 2 },
    { label: "Tedesco", value: 3 },
  ];

  const { id } = useParams();
  const navigate = useNavigate();
  const dialogState = useDialog();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [dimora, setDimora] = useState<Dimora | null>(null);
  const [availableFilters, setAvailableFilters] = useState<IFiltro[] | null>(
    null
  );
  const [availableZones, setAvailableZones] = useState<IIntroZona[] | null>(
    null
  );
  const [availableTypes, setAvailableTypes] = useState<ITipoDimora[] | null>(
    null
  );

  const [selectedTypology, setSelectedTypology] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedFilters, setSelectedFilters] = useState<any>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(languages[0]);

  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File>();
  const [backgroundImage, setBackgroundImage] = useState<File>();

  // fetch dimora details and all available settings like filters
  useEffect(() => {
    const abortController = new AbortController();
    (async () => {
      if (!id) return navigate("/app/dimore/new", { replace: true });
      // TODO: HANDLE NEW DIMORA
      const dimoraId = parseInt(id, 10);
      if (isNaN(dimoraId))
        return navigate("/app/dimore/new", { replace: true });

      setIsLoading(true);
      const results = await Promise.all([
        Api.fetchDimoraById({
          id: +id,
          signal: abortController.signal,
        }),
        Api.fetchFilters({}),
        Api.fetchZone({}),
        Api.fetchDimoreTypes({}),
        Api.fetchLanguages({}),
      ]);
      setIsLoading(false);

      const [dimoraData, filters, zones, dimoreTypes, languages] = results;
      const dimora = new Dimora(dimoraData);
      setDimora(dimora);
      console.log(filters);
      setAvailableFilters(filters);
      setAvailableZones(zones);
      setAvailableTypes(dimoreTypes);
    })();

    return () => {
      // abort request if component unmounts
      setIsLoading(false);
      abortController.abort();
    };
  }, [id]);

  const handleImagesChange = (newPhotos: FileList | null) => {
    if (!newPhotos) return;

    // remove duplicated images
    const newImages = Array.from(newPhotos).filter(
      (image) => !images.find((img) => img.name === image.name)
    );
    setImages([...images, ...newImages]);
  };

  const handleImageDelete = (index: number) => {
    setImages((prevImages) => prevImages.filter((img, i) => i !== index));
  };

  const handleCoverImageChange = (newPhotos: FileList | null) => {
    if (!newPhotos) return;
    setCoverImage(newPhotos[0]);
  };

  const handleBackgroundImageChange = (newPhoto: FileList | null) => {
    if (!newPhoto) return;
    setBackgroundImage(newPhoto[0]);
  };

  const handleDimoraSave = () => {
    const formData = new FormData();
    images.forEach((photo) => {
      formData.append("generalImages", photo);
    });
  };

  const showDeletionAlertDialog = () => {
    dialogState.setDialog({
      title: "Sei sicuro di voler eliminare la dimora?",
      subTitle: "Una volta cancellata non potrà essere recuperata",
      mainActionTitle: "Annulla",
      sideActionTitle: "Conferma",
      onMainActionClick: dialogState.dismissDialog,
    });
    dialogState.showDialog();
  };

  const makeDropDownFilters = (filters: IFiltro[]) => {
    return filters.map((filter) => ({ label: filter.stato, value: filter }));
  };

  const makeDropDownLanguages = (languages: ILingua[]) => {
    return languages.map((language) => ({
      label: language.nome,
      value: language,
    }));
  };

  const makeDropDownTypes = (dimoraTypes: ITipoDimora[]) => {
    return dimoraTypes.map((type) => ({
      label: type.tipo,
      value: type,
    }));
  };

  const makeDropDownZones = (zones: IIntroZona[]) => {
    return zones.map((zone) => ({
      label: zone.descrizione,
      value: zone,
    }));
  };

  const canShowScreen =
    !isLoading && availableFilters && availableTypes && availableZones;

  return (
    <main className="page DimoraDetails">
      <div className="DimoraDetails__titleSection">
        <BackButton />
        <h1 className="title DimoraDetails__titleSection__title">
          {props.action === DimoraDetailsAction.Add
            ? "Crea Nuova Dimora"
            : "Modifica Dimora"}
        </h1>
      </div>
      {canShowScreen ? (
        <>
          <div className="DimoraDetails__fields">
            <div className="DimoraDetails__fields__field">
              <label className="label DimoraDetails__fields__field__label">
                Nome
              </label>
              <input
                type="text"
                placeholder="Inserisci un nome"
                className="input DimoraDetails__fields__field__input"
                autoComplete="off"
                defaultValue={dimora?.nome}
              />
            </div>
            <div className="DimoraDetails__fields__field">
              <label className="label DimoraDetails__fields__field__label">
                Tipologia
              </label>
              <Select
                options={makeDropDownTypes(availableTypes)}
                value={selectedTypology}
                onChange={setSelectedTypology}
                unstyled
                classNames={{
                  ...dropDownStyles,
                  container: (state) =>
                    "multiDropdown DimoraDetails__fields__dropdown",
                }}
              />
            </div>
            <div className="DimoraDetails__fields__field">
              <label className="label DimoraDetails__fields__field__label">
                Zona
              </label>
              <Select
                options={makeDropDownZones(availableZones)}
                value={selectedZone}
                onChange={setSelectedZone}
                unstyled
                classNames={{
                  ...dropDownStyles,
                  container: (state) =>
                    "multiDropdown DimoraDetails__fields__dropdown",
                }}
              />
            </div>
            <div className="DimoraDetails__fields__field">
              <label className="label DimoraDetails__fields__field__label">
                Filtri
              </label>
              <Select
                options={makeDropDownFilters(availableFilters)}
                value={selectedFilters}
                onChange={setSelectedFilters}
                placeholder="Seleziona filtri"
                unstyled
                classNames={{
                  ...dropDownStyles,
                  container: (state) =>
                    "multiDropdown DimoraDetails__fields__filters",
                }}
                isMulti={true as any}
              />
            </div>
          </div>
          <div className="DimoraDetails__description">
            <div className="DimoraDetails__description__title">
              <label className="label DimoraDetails__description__label">
                Descrizione
              </label>
              <Select
                options={languages}
                value={selectedLanguage}
                onChange={setSelectedLanguage}
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
            <textarea
              className="textarea DimoraDetails__description__textarea"
              placeholder="Inserisci una descrizione"
            ></textarea>
          </div>
          <div className="DimoraDetails__images">
            <div className="DimoraDetails__images__cover">
              <label className="label DimoraDetails__images__cover__label">
                Copertina
              </label>
              <div className="DimoraDetails__images__cover__imageWrapper">
                {coverImage && (
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="cover"
                    className="DimoraDetails__images__cover__image"
                  />
                )}
              </div>
              <ImagePicker
                onImagesChange={handleCoverImageChange}
                className="DimoraDetails__images__cover__imagePicker"
              />
            </div>
            <div className="DimoraDetails__images__background">
              <label className="label DimoraDetails__images__background__label">
                Sfondo Intro
              </label>
              <div className="DimoraDetails__images__background__imageWrapper">
                {backgroundImage && (
                  <img
                    src={URL.createObjectURL(backgroundImage)}
                    alt="background"
                    className="DimoraDetails__images__background__image"
                  />
                )}
              </div>
              <ImagePicker
                onImagesChange={handleBackgroundImageChange}
                className="DimoraDetails__images__background__imagePicker"
              />
            </div>
            <div className="DimoraDetails__images__other">
              <label className="label DimoraDetails__images__other__label">
                Altre Immagini
              </label>
              <div className="input DimoraDetails__images__other__container">
                <ImagePicker
                  onImagesChange={handleImagesChange}
                  multipleFiles
                  className="DimoraDetails__images__other__imagesWrapper__imagePicker"
                />
                <div className="DimoraDetails__images__other__imagesWrapper">
                  {images.map((image, index) => (
                    <div
                      className="DimoraDetails__images__other__imageContainer"
                      key={`general-${image.name}`}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt="general"
                        className="DimoraDetails__images__other__imageContainer__image"
                      />
                      <button
                        type="button"
                        className="iconButton DimoraDetails__images__other__imageContainer__button"
                        onClick={() => handleImageDelete(index)}
                      >
                        <CloseSvg className="iconButton__icon DimoraDetails__images__other__imageContainer__button__icon" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="DimoraDetails__actions">
            {props.action === DimoraDetailsAction.Edit && (
              <button
                className="btn DimoraDetails__actions__delete"
                onClick={showDeletionAlertDialog}
              >
                <DeleteSvg className="btn__icon" />
                <span>Elimina</span>
              </button>
            )}
            <button className="btn DimoraDetails__actions__save">
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

export default DimoraDetailsScreen;
