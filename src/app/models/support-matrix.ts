export interface ColorBasedSupportMatrix {
    black : SupportMatrix,
    white : SupportMatrix,
    dominance? : any
}

export interface SupportMatrix {
    details : SquareDetails[]
}

export interface SquareDetails {
    attacking? : string[],
    supportedPiece? : string[],
    supporting? : string[],
    origin : string
}