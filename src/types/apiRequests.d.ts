interface IRequest {
  signal?: AbortSignal;
}

interface IFetchAllDimoreRequest extends IRequest {}

interface IFetchDimoraById extends IRequest {
  dimoraId: number;
}

interface IFetchDimoreByZona extends IRequest {
  zonaId: number;
}

interface IFetchIntroPercorsi extends IRequest {}
