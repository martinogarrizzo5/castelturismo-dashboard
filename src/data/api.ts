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
      signal: params.signal,
    });

    return res.data;
  }

  static async fetchLanguages(params: IFetchLanguages) {
    const res = await axios.get("/lingue", {
      signal: params.signal,
    });

    return res.data as ILingua[];
  }

  static async fetchDimoreTypes(params: IFetchDimoraTypes) {
    const res = await axios.get("/dimore/tipi", {
      signal: params.signal,
    });

    return res.data as ITipoDimora[];
  }

  static async fetchFilters(params: IFetchFilters) {
    const res = await axios.get("/filtri", {
      signal: params.signal,
    });

    return res.data as IFiltro[];
  }

  static async fetchZone(params: IFetchZone) {
    const res = await axios.get("/zone", {
      signal: params.signal,
    });

    return res.data as IIntroZona[];
  }

  static async fetchAllIntroDimore(params: IFetchAllIntroDimore) {
    const res = await axios.get("/dimore/intro", {
      signal: params.signal,
    });

    return res.data as IIntroDimora[];
  }

  static async addItinerario(params: IAddItinerario) {
    const res = await axios.post("/percorso", params.data, {
      signal: params.signal,
    });

    return res;
  }

  static async deleteItinerario(params: IDeleteItinerario) {
    const res = await axios.delete("/percorso", {
      params: { id: params.id },
      signal: params.signal,
    });

    return res;
  }

  static async updateItinerario(params: IUpdateItinerario) {
    const res = await axios.post("/percorso/update", params.data, {
      signal: params.signal,
    });

    return res;
  }

  static async addDimora(params: IAddDimora) {
    const res = await axios.post("/dimora", params.data, {
      signal: params.signal,
    });

    return res;
  }

  static async updateDimora(params: IUpdateDimora) {
    const res = await axios.post("/dimora/update", params.data, {
      signal: params.signal,
    });

    return res;
  }

  static async deleteDimora(params: IDeleteDimora) {
    const res = await axios.delete("/dimora", {
      params: { id: params.id },
      signal: params.signal,
    });

    return res;
  }

  static async getDimoraImages(params: IGetDimoraImages) {
    const res = await axios.get("/dimora/images", {
      params: { id: params.id },
      signal: params.signal,
    });

    return res.data as IFoto[];
  }
}

export default Api;
