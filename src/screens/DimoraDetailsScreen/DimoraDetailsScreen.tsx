import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import TextUtils from "../../utils/textUtils";
import { AxiosError } from "axios";
import {
  NotificationType,
  useNotification,
} from "../../store/notificationStore";
import classNames from "classnames";

export enum DimoraDetailsPageType {
  Add,
  Edit,
}

interface IDimoraDetailsScreenProps {
  pageType: DimoraDetailsPageType;
}

function DimoraDetailsScreen(props: IDimoraDetailsScreenProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const dialogState = useDialog();
  const notificationState = useNotification();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setSaving] = useState<boolean>(false);

  const [filterOptions, setFilterOptions] = useState<IFiltro[] | null>(null);
  const [zoneOptions, setZoneOptions] = useState<IIntroZona[] | null>(null);
  const [TypologyOptions, setTypologyOptions] = useState<ITipoDimora[] | null>(
    null
  );
  const [languageOptions, setLanguageOptions] = useState<ILingua[] | null>(
    null
  );

  const [dimora, setDimora] = useState<Dimora | null>(null);
  const [name, setName] = useState<string>("");
  const [typology, setTypology] = useState<ITipoDimora | null>(null);
  const [zone, setZone] = useState<IIntroZona | null>(null);
  const [filters, setFilters] = useState<IFiltro[]>([]);
  const [language, setLanguage] = useState<ILingua | null>(null);
  const [descriptions, setDescriptions] = useState<Map<string, string> | null>(
    null
  );

  const [urlImages, setUrlImages] = useState<IFoto[]>([]);
  const [urlImagesToDelete, setUrlImagesToDelete] = useState<IFoto[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | String | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | String | null>(
    null
  );

  // states used to check if informations are changed and ready to be saved
  const [oldName, setOldName] = useState<string>("");
  const [oldTypology, setOldTypology] = useState<ITipoDimora | null>(null);
  const [oldZone, setOldZone] = useState<IIntroZona | null>(null);
  const [oldFilters, setOldFilters] = useState<IFiltro[]>([]);
  const [oldDescriptions, setOldDescriptions] = useState<Map<
    string,
    string
  > | null>(null);
  const [oldUrlImages, setOldUrlImages] = useState<IFoto[]>([]);
  const [oldCoverImage, setOldCoverImage] = useState<File | String | null>(
    null
  );
  const [oldBackgroundImage, setOldBackgroundImage] = useState<
    File | String | null
  >(null);

  // fetch dimora details and all available settings like filters
  useEffect(() => {
    const abortController = new AbortController();
    if (props.pageType === DimoraDetailsPageType.Edit) {
      initEditPage(abortController);
    } else if (props.pageType === DimoraDetailsPageType.Add) {
      initAddPage(abortController);
    }

    return () => {
      // abort request if component unmounts
      setIsLoading(false);
      abortController.abort();
    };
  }, [id, navigate, location]);

  const initAddPage = async (abortController: AbortController) => {
    setIsLoading(true);
    const result = await Promise.all([
      Api.fetchFilters({ signal: abortController.signal }),
      Api.fetchZone({ signal: abortController.signal }),
      Api.fetchDimoreTypes({ signal: abortController.signal }),
      Api.fetchLanguages({ signal: abortController.signal }),
    ]);
    setIsLoading(false);

    const [filters, zones, dimoreTypes, languages] = result;

    // set options and display the current set values
    setFilterOptions(filters);
    setZoneOptions(zones);
    setTypologyOptions(dimoreTypes);
    setLanguageOptions(languages);
    setLanguage(languages[0]);
    setDescriptions(new Map());
  };

  const initEditPage = async (abortController: AbortController) => {
    if (!id) return navigate("/app/dimore/new", { replace: true });
    const dimoraId = parseInt(id, 10);
    if (isNaN(dimoraId)) return navigate("/app/dimore/new", { replace: true });

    setIsLoading(true);
    const results = await Promise.all([
      Api.fetchDimoraById({
        id: +id,
        signal: abortController.signal,
      }),
      Api.fetchFilters({ signal: abortController.signal }),
      Api.fetchZone({ signal: abortController.signal }),
      Api.fetchDimoreTypes({ signal: abortController.signal }),
      Api.fetchLanguages({ signal: abortController.signal }),
    ]);
    setIsLoading(false);

    const [dimoraData, filters, zones, dimoreTypes, languages] = results;
    const dimora = new Dimora(dimoraData);
    setDimora(dimora);

    // set options and display the current set values
    setFilterOptions(filters);
    setZoneOptions(zones);
    setTypologyOptions(dimoreTypes);
    setLanguageOptions(languages);

    setCoverImage(dimora.coverPath);
    setOldCoverImage(dimora.coverPath);
    setBackgroundImage(dimora.backgroundPath);
    setOldBackgroundImage(dimora.backgroundPath);
    setUrlImages(dimora.generalPhotos);
    setOldUrlImages([...dimora.generalPhotos]);
    setImages([]);

    setName(dimora.nome);
    setOldName(dimora.nome);
    const descriptions = TextUtils.getTranslations(dimora.descrizione);
    setDescriptions(descriptions);
    setOldDescriptions(new Map(descriptions));

    const selectedType = dimoreTypes.find((el) => el.tipo === dimora.tipologia);
    const selectedZone = zones.find((el) => el.descrizione === dimora.zona);

    if (selectedType) {
      setTypology(selectedType);
      setOldTypology(selectedType);
    }
    if (selectedZone) {
      setZone(selectedZone);
      setOldZone(selectedZone);
    }
    setLanguage(languages[0]);
    setFilters(dimora.filtri);
    setOldFilters([...dimora.filtri]);
  };

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

  const handleUrlImageRemove = (index: number) => {
    // keep a reference of the image to delete it on the server when saving
    let imageToDelete = urlImagesToDelete.find(
      (item) => item.id === urlImages[index].id
    );
    if (!imageToDelete) {
      setUrlImagesToDelete((prevImages) => [...prevImages, urlImages[index]]);
    }

    setUrlImages((prevImages) => prevImages.filter((img, i) => i !== index));
  };

  const handleCoverImageChange = (newPhotos: FileList | null) => {
    if (!newPhotos) return;
    setCoverImage(newPhotos[0]);
  };

  const handleBackgroundImageChange = (newPhoto: FileList | null) => {
    if (!newPhoto) return;
    setBackgroundImage(newPhoto[0]);
  };

  const getTranslatedDescription = () => {
    if (!language || !descriptions) return "";
    const translation = descriptions.get(language.codice);
    if (!translation) return "";

    return translation;
  };

  const onDescriptionsChange = (text: string) => {
    const newDescriptions = new Map(descriptions);
    newDescriptions.set(language!.codice, text);
    setDescriptions(newDescriptions);
  };

  const addDimora = async () => {
    if (!coverImage || !backgroundImage || !descriptions || !typology || !zone)
      return;

    const formData = new FormData();
    images.forEach((photo) => {
      formData.append("generalImages[]", photo);
    });
    if (coverImage instanceof File) {
      formData.set("coverImage", coverImage);
    }
    if (coverImage instanceof File) {
      formData.set("backgroundImage", backgroundImage as File);
    }

    const filtersId = filters.map((filter) => filter.id);

    formData.set("filterIds", JSON.stringify(filtersId));
    formData.set("languageCodes", JSON.stringify([...descriptions.keys()]));
    formData.set("name", name);
    formData.set("typeId", JSON.stringify(typology.id));
    formData.set("zonaId", JSON.stringify(zone.id));
    formData.set("descriptions", JSON.stringify([...descriptions.values()]));

    formData.forEach(function (value, key) {
      console.log(key + ": " + value);
    });

    try {
      setSaving(true);
      const response = await Api.addDimora({ data: formData });
      notificationState.showNotification(
        response.data.message,
        NotificationType.Success
      );
      setSaving(false);
      navigate(`/app/dimore/${response.data["id"]}`, { replace: true });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        notificationState.showNotification(
          (error.response.data as any).error,
          NotificationType.Error
        );
      }
      setSaving(false);
    }
  };

  const updateDimora = async () => {
    if (
      !id ||
      !coverImage ||
      !backgroundImage ||
      !descriptions ||
      !typology ||
      !zone
    )
      return;

    const formData = new FormData();
    formData.set("id", id);

    // update general props
    const filtersId = filters.map((filter) => filter.id);
    formData.set("filterIds", JSON.stringify(filtersId));
    formData.set("languageCodes", JSON.stringify([...descriptions.keys()]));
    formData.set("name", name);
    formData.set("typeId", JSON.stringify(typology.id));
    formData.set("zonaId", JSON.stringify(zone.id));
    formData.set("descriptions", JSON.stringify([...descriptions.values()]));

    const imagesToDelete = urlImagesToDelete.map((image) =>
      image.path.split("/").at(-1)
    );
    formData.set("generalImagesToDelete", JSON.stringify(imagesToDelete));

    images.forEach((photo) => {
      formData.append("newGeneralImages[]", photo);
    });

    if (coverImage instanceof File) {
      formData.set("newCoverImage", coverImage);
    }

    if (backgroundImage instanceof File) {
      formData.set("newBackgroundImage", backgroundImage);
    }

    try {
      setSaving(true);
      const response = await Api.updateDimora({ data: formData });
      setSaving(false);
      notificationState.showNotification(
        response.data.message,
        NotificationType.Success
      );

      // disable save button
      setOldBackgroundImage(backgroundImage);
      setOldCoverImage(coverImage);
      setOldFilters([...filters]);
      setOldDescriptions(new Map(descriptions));
      setOldName(name);
      setOldTypology(typology);
      setOldZone(zone);

      // refetch the general images to get their new paths
      setUrlImages([]);
      setOldUrlImages([]);
      setImages([]);
      const newImages = await Api.getDimoraImages({ id: +id });
      // we only need the images that are not cover or background
      const newGeneralImages = newImages.filter((img) => img.copertina === 0);
      setUrlImages(newGeneralImages);
      setOldUrlImages(newGeneralImages);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        notificationState.showNotification(
          (error.response.data as any).error,
          NotificationType.Error
        );
      }
      setSaving(false);
    }
  };

  const deleteDimora = async () => {
    if (!dimora) return;

    try {
      setSaving(true);
      const response = await Api.deleteDimora({ id: dimora.id });
      notificationState.showNotification(
        response.data.message,
        NotificationType.Success
      );
      setSaving(false);
      dialogState.dismissDialog();
      navigate(`/app/dimore`, { replace: true });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.data) {
        notificationState.showNotification(
          (error.response.data as any).error,
          NotificationType.Error
        );
      }
      dialogState.dismissDialog();
      setSaving(false);
    }
  };

  const showDeletionAlertDialog = () => {
    dialogState.setDialog({
      title: "Sei sicuro di voler eliminare la dimora?",
      subTitle: "Una volta cancellata non potrà essere recuperata",
      mainActionTitle: "Annulla",
      sideActionTitle: "Conferma",
      onMainActionClick: dialogState.dismissDialog,
      onSideActionClick: deleteDimora,
    });
    dialogState.showDialog();
  };

  const areDescriptionsChanged = () => {
    if (!oldDescriptions || !descriptions) return false;

    for (const [key, value] of descriptions) {
      if (oldDescriptions.get(key) === undefined) {
        if (value !== "") return true;
      } else if (oldDescriptions.get(key) !== value) {
        return true;
      }
    }

    return false;
  };

  const areFiltersChanged = () => {
    const filterIds = filters.map((filter) => filter.id);
    const oldFilterIds = new Set(oldFilters.map((filter) => filter.id));
    if (filterIds.length !== oldFilterIds.size) return true;

    for (let id of filterIds) {
      if (!oldFilterIds.has(id)) {
        return true;
      }
    }

    return false;
  };

  const areGeneralImagesChanged = () => {
    const oldImageIds = new Set(oldUrlImages.map((img) => img.id));
    const imageIds = urlImages.map((img) => img.id);

    // case any old image was removed
    if (oldImageIds.size !== imageIds.length) return true;
    // case any image was uploaded
    if (images.length) return true;

    for (let id of imageIds) {
      if (!oldImageIds.has(id)) {
        return true;
      }
    }

    return false;
  };

  const canShowScreen =
    !isLoading &&
    filterOptions &&
    TypologyOptions &&
    zoneOptions &&
    languageOptions;

  const addCondition =
    props.pageType === DimoraDetailsPageType.Add &&
    name !== "" &&
    descriptions &&
    coverImage &&
    backgroundImage &&
    images &&
    zone &&
    typology;

  const updateCondition =
    props.pageType === DimoraDetailsPageType.Edit &&
    (name !== oldName ||
      zone !== oldZone ||
      typology !== oldTypology ||
      areDescriptionsChanged() ||
      areFiltersChanged() ||
      coverImage !== oldCoverImage ||
      backgroundImage !== oldBackgroundImage ||
      areGeneralImagesChanged());

  const canSave = addCondition || updateCondition;
  const saveDimoraAction =
    props.pageType === DimoraDetailsPageType.Add ? addDimora : updateDimora;

  return (
    <main className="page DimoraDetails">
      <div className="DimoraDetails__titleSection">
        <BackButton />
        <h1 className="title DimoraDetails__titleSection__title">
          {props.pageType === DimoraDetailsPageType.Add
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
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="DimoraDetails__fields__field">
              <label className="label DimoraDetails__fields__field__label">
                Tipologia
              </label>
              <Select
                options={TypologyOptions}
                value={typology}
                onChange={setTypology}
                getOptionLabel={(option) => option.tipo}
                getOptionValue={(option) => option.id.toString()}
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
                options={zoneOptions}
                value={zone}
                getOptionLabel={(option) => option.descrizione}
                getOptionValue={(option) => option.id.toString()}
                onChange={setZone}
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
                options={filterOptions}
                value={filters}
                getOptionLabel={(option) => option.stato}
                getOptionValue={(option) => option.id.toString()}
                placeholder="Seleziona filtri"
                unstyled
                classNames={{
                  ...dropDownStyles,
                  container: (state) =>
                    "multiDropdown DimoraDetails__fields__filters",
                }}
                // TODO: fix types on library update
                isMulti={true as any}
                onChange={setFilters as any}
              />
            </div>
          </div>
          <div className="DimoraDetails__description">
            <div className="DimoraDetails__description__title">
              <label className="label DimoraDetails__description__label">
                Descrizione
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
            <textarea
              className="textarea DimoraDetails__description__textarea"
              placeholder="Inserisci una descrizione"
              value={getTranslatedDescription()}
              onChange={(e) => onDescriptionsChange(e.target.value)}
            ></textarea>
          </div>
          <div className="DimoraDetails__images">
            <div className="DimoraDetails__images__cover">
              <label className="label DimoraDetails__images__cover__label">
                Copertina
              </label>
              <div className="DimoraDetails__images__cover__imageWrapper">
                {coverImage instanceof File && (
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="cover"
                    className="DimoraDetails__images__cover__image"
                  />
                )}
                {typeof coverImage === "string" && (
                  <img
                    src={coverImage}
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
                {backgroundImage instanceof File && (
                  <img
                    src={URL.createObjectURL(backgroundImage)}
                    alt="background"
                    className="DimoraDetails__images__background__image"
                  />
                )}
                {typeof backgroundImage === "string" && (
                  <img
                    src={backgroundImage}
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
                  {urlImages.map((image, index) => (
                    <div
                      className="DimoraDetails__images__other__imageContainer"
                      key={`url-general-${image.path}`}
                    >
                      <img
                        src={image.path}
                        alt="general"
                        className="DimoraDetails__images__other__imageContainer__image"
                      />
                      <button
                        type="button"
                        className="iconButton DimoraDetails__images__other__imageContainer__button"
                        onClick={() => handleUrlImageRemove(index)}
                      >
                        <CloseSvg className="iconButton__icon DimoraDetails__images__other__imageContainer__button__icon" />
                      </button>
                    </div>
                  ))}
                  {images.map((image, index) => (
                    <div
                      className="DimoraDetails__images__other__imageContainer"
                      key={`uploaded-general-${image.name}`}
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
            {props.pageType === DimoraDetailsPageType.Edit && (
              <button
                className="btn DimoraDetails__actions__delete"
                onClick={showDeletionAlertDialog}
              >
                <DeleteSvg className="btn__icon" />
                <span>Elimina</span>
              </button>
            )}
            <button
              className={classNames(
                "btn DimoraDetails__actions__save",
                !canSave && "btn--disabled"
              )}
              onClick={canSave && !isSaving ? saveDimoraAction : () => {}}
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

export default DimoraDetailsScreen;
