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
}

export default Api;
