import { Player } from "./player";

export interface Tournament {
    id : string
    name : string
    startDate? : string
    endDate? : string
    site? : string
    players? : Player[]
    rounds? : number
    year? : number
    country? : string
    countryCode? : string
    state? : string
    havingGame? : boolean
    completed? : boolean
    source? :string
    slug? : string
}