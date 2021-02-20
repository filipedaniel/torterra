class Type {
  code: number;
  description: string;
}

export class Dossier {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  updatedAt: Date;
  createdAt: Date;

  constructor(title: string, description: string, image: string, type: number) {
    this.title = title;
    this.description = description;
    this.image = image;
  }
}
