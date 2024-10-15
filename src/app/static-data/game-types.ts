let gameTypes = [
    {
        "name" : "Rook Endgame",
        "value":"ROOK_ENDGAME",
        "desc":"Both players has rook"
    },
    {
        "name" : "Bishop Endgame",
        "value":"BISHOP_ENDGAME",
        "desc":"Both players has bishop"
    },
    {
        "name" : "Bishop and Knight Endgame",
        "value":"BISHOP_KNIGHT_ENDGAME",
        "desc":"Both players has bishop and knight"
    },
    {
        "name" : "Knight Endgame",
        "value":"KNIGHT_ENDGAME",
        "desc":"Both players has knight"
    },
    {
        "name" : "Pawn Endgame",
        "value":"PAWN_ENDGAME",
        "desc":"Both players has only pawns"
    },
    {
        "name" : "Queen Imbalanced game",
        "value":"QUEEN_IMBALANCED_GAME",
        "desc":"One player has queen and nother other pieces for queen"
    },
    {
        "name" : "Rook vs knightand Bishop Endgame",
        "value":"ROOK_KNIGHT_BISHOP_ENDGAME",
        "desc":"One players has bishop and knight other has rook"
    },
    {
        "name" : "Bishop vs Pawn Endgame",
        "value":"BISHOP_VS_PAWN_ENDGAME",
        "desc":"One player has bishop other has just pawns"
    },
    {
        "name" : "Knight vs Pawn Endgame",
        "value":"KNIGHT_VS_PAWN_ENDGAME",
        "desc":"One player has knight other has just pawns"
    },
    {
        "name" : "Rook vs Pawn Endgame",
        "value":"ROOK_VS_PAWN_ENDGAME",
        "desc":"One player has rook other has just pawns"
    },
    {
        "name" : "Rook vs Pawn Endgame",
        "value":"BISHOP_VS_KNIGHT_ENDGAME",
        "desc":"One player has knight other has Bishop"
    },
    {
        "name" : "Miniature games",
        "value":"MINIATURE",
        "desc":"games that run for less than 25 moves"
    },
    {
        "name" : "Miniature games",
        "value":"LONG_GAME",
        "desc":"games that run for more than 70 moves"
    }
]

let sacTypes = [
    {"name":"Rook Sacrifice", "value": "ROOK"},
    {"name":"Queen Sacrifice", "value": "QUEEN"}
]

export {gameTypes}
export {sacTypes}