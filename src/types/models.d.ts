interface IZona {
  id: number;
  dimore: Dimora[];
}

interface IIntroZona {
  id: number;
  descrizione: string;
  dimoreCount: number;
}

interface IDimora {
  id: number;
  zona: string;
  nome: string;
  descrizione: string;
  tipologia: string;
  foto: Foto[];
  filtri: Filtro[];
}

interface IIntroDimora {
  id: number;
  nome: string;
  imageUrl: string;
}

interface IFoto {
  id: number;
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

interface ILingua {
  id: number;
  codice: string;
  nome: string;
}

interface IIntroPercorso {
  id: number;
  descrizione: string;
  path: string;
}

interface IPercorso {
  id: number;
  dimore: Dimora[];
  descrizione: string;
  durata: number;
  imageUrl: string;
}

interface ITipoDimora {
  id: number;
  tipo: string;
}
