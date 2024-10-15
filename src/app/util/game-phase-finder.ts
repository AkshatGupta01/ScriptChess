/**
 * finds the phase of the games. Based on logic of material, if the material is more than 13 then it's middle game otherwise endgame
 * @param fen fen of the position
 * @returns 1 for end game 0 for middle game
 */
export function findGamePhase(fen : string) : number {
    fen = fen.toLowerCase()
    let pawns = fen.split("p").length -1
    let rooks  = fen.split("r").length -1
    let knights  = fen.split("n").length -1
    let bishops  = fen.split("b").length -1
    let queens  = fen.split("q").length -1
    let points = pawns + rooks * 5 + (knights + bishops) * 3 + queens * 9
    return Math.floor(points/2) > 13 ? 0 : 1;
}