class Dimora implements IDimora {
  id: number;
  zona: string;
  nome: string;
  descrizione: string;
  tipologia: string;
  foto: IFoto[];
  filtri: IFiltro[];
  placeholderImage: string =
    "https://cdn.pixabay.com/photo/2012/02/28/10/22/background-18176_960_720.jpg";

  constructor(dimora: IDimora) {
    this.id = dimora.id;
    this.zona = dimora.zona;
    this.nome = dimora.nome;
    this.descrizione = dimora.descrizione;
    this.tipologia = dimora.tipologia;
    this.foto = dimora.foto;
    this.filtri = dimora.filtri;
  }

  get coverPath(): string {
    let cover = this.placeholderImage;

    for (let foto of this.foto) {
      if (foto.copertina === 1) {
        cover = foto.path;
      }
    }
    return cover;
  }

  get backgroundPath(): string {
    let background = this.placeholderImage;

    for (let foto of this.foto) {
      if (foto.copertina === 2) {
        background = foto.path;
      }
    }
    return background;
  }

  get generalPhotos(): IFoto[] {
    let photos: IFoto[] = [];

    for (let foto of this.foto) {
      if (foto.copertina !== 1 && foto.copertina !== 2) {
        photos.push(foto);
      }
    }
    return photos;
  }
}

export default Dimora;
