import { Category } from "./categories";


export interface Post {
    id: number;
    title: string;
    description: string;
    content: string;
    slug: string;
    category?: Category;
    author?: Author;
    published_at: string;
    created_at?: string;
    updated_at?: string;
    image?: PictureOrImage;
    faq? : Faq[];
    seo? : Seo;
    tags? : Tag[]
  }
  export interface Page {
    id: number;
    title: string;
    content: string;
    slug: string;
    writer?: Author;
    published_at: string;
    created_at?: string;
    updated_at?: string;
    faq? : Faq[];
    seo? : Seo;
    tags? : Tag[];
    image?: PictureOrImage;
    media?: PictureOrImage;
  }
  export interface Author {
    id?: number;
    name: string;
    email?: string;
    created_at?: string;
    updated_at?: string;
    picture?: PictureOrImage;
    Facebook?: string;
    Linkedin?: string;
    dribble?: string;
    twitter?: string;
    About?: string;
    Instagram?: string;
    chess? : string;
    lichess? : string
  }
  export interface PictureOrImage {
    id?: number;
    name?: string;
    alternativeText?: null;
    caption?: null;
    width?: number;
    height?: number;
    formats?: Formats;
    hash?: string;
    ext?: string;
    mime?: string;
    size?: number;
    url: string;
    previewUrl?: null;
    provider?: string;
    provider_metadata?: null;
    created_at?: string;
    updated_at?: string;
  }
  export interface Formats {
    thumbnail: ThumbnailOrLargeOrMediumOrSmall;
    large: ThumbnailOrLargeOrMediumOrSmall;
    medium: ThumbnailOrLargeOrMediumOrSmall;
    small: ThumbnailOrLargeOrMediumOrSmall;
  }
  export interface ThumbnailOrLargeOrMediumOrSmall {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    width: number;
    height: number;
    size: number;
    path?: null;
    url: string;
  }
  export interface Faq {
    id : number;
    question: string;
    answer: string;
  }

  export interface Seo {
    id : number;
    metaTitle: string;
    metaDescription: string;
    shareImage: PictureOrImage
  }

  export interface Tag {
    name  :string,
    slug : string
  }