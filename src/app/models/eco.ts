export interface ECO {
    eco:string
    count : number
    ecoModel : EcoModel
}

export interface EcoModel {
    id :string
    name : string
    eco :string
    fen : string
    moves: string
    slug : string
    fens?: string[]
}