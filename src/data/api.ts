import axios from "./axios";

class Api {
  static async fetchAllDimore(params: IFetchAllDimoreRequest) {
    const res = await axios.get("/dimore", { signal: params.signal });
    return res.data as IDimora[];
  }

  static async fetchDimoraById(params: IFetchDimoraById) {
    const res = await axios.get(`/dimore`, {
      signal: params.signal,
    });
    return res.data as IDimora;
  }

  static async fetchDimoreByZona(params: IFetchDimoreByZona) {
    const res = await axios.get(`/zona`, {
      signal: params.signal,
      params: { zona: params.zonaId },
    });
    return res.data as IZona;
  }

  static async fetchIntroPercorsi(params: IFetchIntroPercorsi) {
    const res = await axios.get(`/percorsi`, {
      signal: params.signal,
    });
    return res.data as IIntroPercorso[];
  }
}

export default Api;
