interface IZona {
  id: number;
  dimore: Dimora[];
}

interface IDimora {
  id: number;
  zona: string;
  nome: string;
  descrizione: string;
  tipologia: string;
  foto: Foto[];
  // TODO: find related filters
}

interface IFoto {
  id: number;
  dimora: number;
  path: string;
  copertina: number;
}

interface ICredits {
  id: number;
  descrizione: string;
}

interface IFiltro {
  id: number;
  stato: string;
}

interface IIntroPercorso {
  id: number;
  descrizione: string;
  path: string;
}

interface IPercorso {
  id: number;
  dimore: Dimora[];
}
