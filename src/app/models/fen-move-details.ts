export interface FenMove {    
    move : string
    moveDetails : FenMoveDetails
}

export interface FenMoveDetails {
    white : number
    black : number
    draw : number
}

