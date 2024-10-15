import { PictureOrImage } from "./post";

export interface Banner {
    title : string
    imagePath: string
    id: number
    description? : string
    readMeText? : string
    link: string
    created_at: string
    published_at : string
    image : PictureOrImage
}