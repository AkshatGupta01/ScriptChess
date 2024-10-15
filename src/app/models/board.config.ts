export interface BoardConfig {
    position? : any
    orientation? : ChessColors | string
    showNotation? : boolean
    dropOffBoard? : DropOffBoardSetting | string
    pieceTheme? : string
    moveSpeed? : Speed
    draggable? : boolean
    sparePieces? : boolean
    snapbackSpeed? : number
    snapSpeed? : number
    onChange? : any
    onDragStart? : any
    onDragMove? : any
    onDrop? : any
    onMouseoutSquare? : any
    onMouseoverSquare? : any
    onMoveEnd? : any
    onSnapbackEnd? : any
    onSnapEnd? : any
    enableDoubleTap ? : boolean
    onSecondTap ? : any
    onFirstTap  ?: any
}

export enum ChessColors {
    white = 1 , black = 2
}

export enum DropOffBoardSetting {
    snapback, trash
}

export enum Speed {
    slow, fast
}
