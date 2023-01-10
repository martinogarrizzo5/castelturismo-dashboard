import axios from "./axios";

class Api {
  static async fetchAllDimore(params: IFetchAllDimoreRequest) {
    const res = await axios.get("/dimore", { signal: params.signal });
    return res.data as IDimora[];
  }

  static async fetchDimoraById(params: IFetchDimoraById) {
    const res = await axios.get(`/dimora`, {
      signal: params.signal,
      params: { id: params.id },
    });
    return res.data as IDimora;
  }

  static async searchDimore(params: ISearchDimora) {
    const res = await axios.get(`/dimore`, {
      params: { search: params.name, zonaId: params.zonaId },
    });
    return res.data as IDimora[];
  }

  static async fetchDimoreByZona(params: IFetchDimoreByZona) {
    const res = await axios.get(`/zona`, {
      signal: params.signal,
      params: { zona: params.id },
    });
    return res.data as IZona;
  }

  static async fetchIntroPercorsi(params: IFetchIntroPercorsi) {
    const res = await axios.get(`/percorsi`, {
      signal: params.signal,
    });
    return res.data as IIntroPercorso[];
  }

  static async fetchPercorsoById(params: IFetchPercorsoById) {
    const res = await axios.get("/percorso", {
      signal: params.signal,
      params: { id: params.id },
    });

    return res.data as IPercorso;
  }

  static async fetchCredits(params: IFetchCredits) {
    const res = await axios.get(`/credits`, {
      signal: params.signal,
    });

    return res.data[0] as ICredits;
  }

  static async updateCredits(params: IUpdateCredits) {
    const res = await axios.post("/credits", {
      description: params.description,
    });

    return res.data as ICreditsUpdateResponse;
  }

  static async fetchLanguages(params: IFetchLanguages) {
    const res = await axios.get("/lingue");

    return res.data as ILingua[];
  }

  static async fetchDimoreTypes(params: IFetchDimoraTypes) {
    const res = await axios.get("/tipi-dimora");

    return res.data as ITipoDimora[];
  }

  static async fetchFilters(params: IFetchFilters) {
    const res = await axios.get("/filtri");

    return res.data as IFiltro[];
  }

  static async fetchZone(params: IFetchZone) {
    const res = await axios.get("/zone");

    return res.data as IIntroZona[];
  }

  static async fetchDimoraTypes(params: IFetchDimoraTypes) {
    const res = await axios.get("/tipi-dimora");

    return res.data as ITipoDimora[];
  }
}

export default Api;
