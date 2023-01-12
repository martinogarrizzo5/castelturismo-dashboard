interface IRequest {
  signal?: AbortSignal;
}

interface IFetchAllDimoreRequest extends IRequest {}

interface IFetchDimoraById extends IRequest {
  id: number;
}

interface ISearchDimora extends IRequest {
  name?: string | null;
  zonaId?: number | null;
}

interface IFetchDimoreByZona extends IRequest {
  id: number;
}

interface IFetchIntroPercorsi extends IRequest {}

interface IFetchPercorsoById extends IRequest {
  id: number;
}

interface IFetchCredits extends IRequest {}

interface IUpdateCredits extends IRequest {
  description: string;
}

interface IFetchLanguages extends IRequest {}

interface IFetchDimoraTypes extends IRequest {}

interface IFetchZone extends IRequest {}

interface IFetchFilters extends IRequest {}

interface IFetchAllIntroDimore extends IRequest {}

interface IAddItinerario extends IRequest {
  data: FormData;
}

interface IUpdateItinerario extends IRequest {
  data: FormData;
}

interface IDeleteItinerario extends IRequest {
  id: number;
}
