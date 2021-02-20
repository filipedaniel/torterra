export class Post {
  _id: string;
  title: string;
  slug: string;
  description: string;
  featureImage: string;
  images: [{
    url: string
  }];
  content: string;
  date: Date;
  author: string;
  dossier: string;
  updatedAt: Date;
  createdAt: Date;
}
