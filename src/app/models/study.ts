import { Author, Faq, PictureOrImage, Seo, Tag } from "./post";

export interface Study {
  id : number,
    name: string;
    body: string;
    slug: string;
    author?: Author;
    published_at: string;
    created_at?: string;
    updated_at?: string;
    image?: PictureOrImage[];
    faq? : Faq[];
    seo? : Seo;
    tags? : Tag[]
  }