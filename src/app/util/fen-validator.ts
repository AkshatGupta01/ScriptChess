


import * as ChessJS from 'src/app/util/chessjs/chess';
import { PiecePosition, PositionAnalysisForBothSide, WEAKNESS } from '../models/weaknesses';
import { ChessColors } from '../models/board.config';
import { PrimaryLine } from '../models/move';
import { Chess } from 'chess.js';
import { getCoverageMatrix } from './chessjsutil';
export const MIN_WHITE_PIECE_INT = 66
export const MAX_WHITE_PIECE_INT = 82
export const MIN_BLACK_PIECE_INT = 98
export const MAX_BLACK_PIECE_INT = 113
export function validateFenEx(chess : ChessJS.Chess, fen : string) {
    const errors = []
    errors[0] = 'Duplicate kings found'
    errors[1] = 'Pawns on 8th or 1st rank'
    errors[2] = 'Must have atleast one king from each side'
    errors[3] = "Side to play, should not be attacking opponent's king"

    const tokens = fen.split(/\s+/)
    const rows = tokens[0].split('/')

      // check for duplicate kings
      let blackKingCount = tokens[0].split("k");
      if(blackKingCount.length > 2) {
        return { valid: false, errorNumber: 12, error: errors[0] }
      }

      let whiteKingCount = tokens[0].split("K");
      if(whiteKingCount.length > 2) {
        return { valid: false, errorNumber: 12, error: errors[0] }
      }

      if(whiteKingCount.length < 2 || blackKingCount.length < 2 ) {
        return { valid: false, errorNumber: 14, error: errors[2] }
      }

      //check for pawns on 1st and 8th rank
      if(rows[0].indexOf("p") > -1 || rows[0].indexOf("P") > -1 || rows[7].indexOf("p") > -1 || rows[7].indexOf("P") > -1) {
        return { valid: false, errorNumber: 13, error: errors[1] }
      }
      let moves = chess.moves({ verbose: true });
      for(let i =0 ; i<moves.length; i++) {
        let turn = chess.turn();
        let turnToCheck = turn == 'w' ? 'b' : 'w'
        let square = moves[i]["to"]
        let squareD = chess.get(square);
        if(squareD.color == turnToCheck && squareD.type.toLocaleLowerCase() == 'k') {
            return { valid: false, errorNumber: 13, error: errors[3] }
        }
      }
      return {valid : true}

}

export function getHalfMoveNumberFromFen(fen : string) {
  let tokens = fen.split(" ");
  let turn = tokens[1];
  let moveNumber = Number.parseInt(tokens[tokens.length -1]);
  return turn == 'w' ? moveNumber * 2 -1 : moveNumber * 2;
}

export function getMaterialDifference(fen : string) {
  let pieces = {
    p:0,
    r:0,
    n:0,
    b:0,
    q:0,
    P:0,
    R:0,
    N:0,
    B:0,
    Q:0,
    black : 0,
    white : 0,
    diff : 0
  }
  for(let index = 0; index<fen.length; index++) {
    if(pieces[fen[index]] || pieces[fen[index]] == 0) {
      pieces[fen[index]]++;
    }
  }

  let black = pieces['p'] + pieces['r'] + pieces['n'] + pieces['b'] + pieces['q']
  let white = pieces['P'] + pieces['R'] + pieces['N'] + pieces['B'] + pieces['Q']
  pieces["black"] = black
  pieces["white"] = white
  pieces["diff"] = white - black;
  return pieces;
}

export function analyzeWeakness(fen) {
  return analyzeWeaknessEx(fen, null)
}
export function analyzeWeaknessEx(fen : string, position) {
  let chess = new ChessJS.Chess(fen);
  if(chess.isCheck()) {
    let weakness = {
      weakness : WEAKNESS[WEAKNESS.IN_CHECK]
    }
    let weaknesses = []
    weaknesses.push(weakness)
    return weaknesses;
  }
  let column = ['a','b','c','d','e','f','g','h']
  let row = ['1','2','3','4','5','6','7','8']
  let pieces : PiecePosition = {
    p:[],
    r:[],
    n:[],
    b:[],
    q:[],
    k: [],
    P:[],
    R:[],
    N:[],
    B:[],
    Q:[],
    K: []
  }
  let squarePieceMap = {}
  ChessJS.SQUARES.forEach(square=> {
    let piece = chess.get(square)
    if(piece) {
      if(piece.color == 'b') {
        pieces[piece.type].push(square)
        squarePieceMap[square] = piece.type
      }
      else {
        pieces[piece.type.toUpperCase()].push(square)
        squarePieceMap[square] = piece.type.toUpperCase();
      }

    }

  })
  let analysis : PositionAnalysisForBothSide = {
    b : [],
    w : []
  }
  analysis.w = analysePosition(pieces, ChessColors.white, squarePieceMap, chess, position)
  analysis.b = analysePosition(pieces, ChessColors.black, squarePieceMap, chess, position)
  return analysis;
}

export function analysePosition(pieces : PiecePosition, color : ChessColors, squarePieceMap, chess, position) {
  //calculate Weaknesses
  let p = ['p','r','n','b','q','k']
  if(color == ChessColors.white) {
    p = ['P','R','N','B','Q','K']
  }
  let columnsWithPawn = []
  pieces[p[0]].forEach(p=> {
    columnsWithPawn.push(p[0])
  })

  let weaknesses = []
  let moves = chess.getSupportedSquares({color : color == ChessColors.black ? 'b' : 'w', legal: true})
  let pieceSupportMap = {}
  let squareSupportMap = {}

  if(moves && moves.length > 0) {
    moves.forEach(move=> {
      if(squarePieceMap[move.to] && (squarePieceMap[move.to] == p[1] || squarePieceMap[move.to] == p[2] || squarePieceMap[move.to] == p[3] || squarePieceMap[move.to] == p[4])) {
        //this move, supports a piece
        if(!pieceSupportMap[move.from]) {
          pieceSupportMap[move.from] = []
        }
        pieceSupportMap[move.from].push(move.to)
        if(!squareSupportMap[move.to]) {
          squareSupportMap[move.to] = 0
        }
        //this piece has support
        squareSupportMap[move.to]++;
      }
    })
  }
  if(pieces[p[0]]) {
    let doublePawnWeaknesses = findDoublePawns(pieces, p, color);
    let isolatedPawns = findIsolatedPawns(pieces, p, color, columnsWithPawn)
    let isolatedPawnCouples = findIsolatedPawnsCouple(pieces, p, columnsWithPawn, color)
    let overLoadedPiece = findOverLoadedPiece(pieces, p, squarePieceMap,chess, color, moves, pieceSupportMap, squareSupportMap)
    let hangingPiece = findHangingPiece(pieces, p, squarePieceMap,chess, color, pieceSupportMap, squareSupportMap, position)
    if(doublePawnWeaknesses && doublePawnWeaknesses.length > 0)
      weaknesses.push(doublePawnWeaknesses)
    if(isolatedPawns && isolatedPawns.length > 0)
      weaknesses.push(isolatedPawns)
    if(isolatedPawnCouples && isolatedPawnCouples.length > 0)
      weaknesses.push(isolatedPawnCouples)
    if(overLoadedPiece && overLoadedPiece.length > 0) {
      weaknesses.push(overLoadedPiece)
    }
    if(hangingPiece && hangingPiece.length > 0) {
      weaknesses.push(hangingPiece)
    }
  }

  return weaknesses;
}

export function findHangingPiece(pieces : PiecePosition, p, squarePieceMap, chess : ChessJS.Chess, color, pieceSupportMap, squareSupportMap, position) {
  let hangingPieces = []
  /*let supportedSquares : Set<string> = new Set<string>();
  let moves = chess.getSupportedSquares({color : color == ChessColors.black ? 'b' : 'w', legal: true})
  if(moves && moves.length > 0) {
    moves.forEach(m=> {
      supportedSquares.add(m.to)
    })
  }
  Object.keys(squarePieceMap).forEach(square=> {
    if((squarePieceMap[square] == p[0] || squarePieceMap[square] == p[1] || squarePieceMap[square] == p[2] || squarePieceMap[square] == p[3] || squarePieceMap[square] == p[4])
      && !supportedSquares.has(square)) {
        let weakness = {
          square : square,
          piece : squarePieceMap[square],
          weakness : WEAKNESS[WEAKNESS.HANGING_PIECE]
        }
        hangingPieces.push(weakness)
    }
  })*/
  let colorStr  = color == ChessColors.black ? 'b' : 'w';
  let matrix = getCoverageMatrix(chess, position)
  console.log(position)
  console.log(matrix)
  Object.keys(position).forEach(square=> {
    if(position[square][0] == 'w' && matrix.dominance[square] <= 0 && colorStr == 'w') {
      let weakness = {
        square : square,
        piece : squarePieceMap[square],
        weakness : WEAKNESS[WEAKNESS.HANGING_PIECE]
      }
      hangingPieces.push(weakness)
    } else {
      if(position[square][0] == 'b' && matrix.dominance[square] >= 0  && colorStr == 'b') {
        let weakness = {
          square : square,
          piece : squarePieceMap[square],
          weakness : WEAKNESS[WEAKNESS.HANGING_PIECE]
        }
        hangingPieces.push(weakness)
      }
    }
  })
  return hangingPieces;

}
export function findOverLoadedPiece(pieces : PiecePosition, p, squarePieceMap, chess : ChessJS.Chess, color, moves, pieceSupportMap, squareSupportMap) {
  let overloadedPiece = []
  Object.keys(pieceSupportMap).forEach(ss=> {
    let hasOnlyOneSupport = true;
    if(pieceSupportMap[ss].length > 1 || pieceSupportMap[ss].length == 2) {
      pieceSupportMap[ss].forEach(supportedSquare=> {
        if(squareSupportMap[supportedSquare] > 1) {
          hasOnlyOneSupport = false
        }
      })
    } else {
      if(pieceSupportMap[ss].length > 2) {
        hasOnlyOneSupport = true;
      }
    }

    if(hasOnlyOneSupport && pieceSupportMap[ss].length > 1) {
      let weakness = {
        square : ss,
        squares : pieceSupportMap[ss],
        piece : squarePieceMap[ss],
        weakness : WEAKNESS[WEAKNESS.OVERLOADED_PIECE]
      }
      overloadedPiece.push(weakness)
    }
  })

  return overloadedPiece;
}

export function findIsolatedPawnsCouple(pieces : PiecePosition, p, columnsWithPawn, color) {
  let isolatedPawnCouples = []
  let pawnsSquares = pieces[p[0]]
  let ipcFound = [];
  //let isolatedPawns = findIsolatedPawns(pieces, p, color, columnsWithPawn)
  pawnsSquares.forEach(ip=> {
    if(ipcFound.indexOf(ip) < 0) {
      let column = ip.charCodeAt(0)
      let file = Number.parseInt(ip[1])
      if(column == 97) {
        if(columnsWithPawn.indexOf('b') > -1 && columnsWithPawn.indexOf('c') < 0) {
          let weakness = {
            squares : [],
            pieces : [],
            weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN_COUPLE]
          }
          weakness.squares.push(ip)
          weakness.pieces.push(p[0])
          weakness.pieces.push(p[0])
          isolatedPawnCouples.push(weakness)
          pawnsSquares.forEach(s => {
            if(s[0] == 'b') {
              weakness.squares.push(s)
              ipcFound.push(s)
            }
          })
        }
      } else {
        if(column == 104) {
          if(columnsWithPawn.indexOf('g') > -1 && columnsWithPawn.indexOf('f') < 0) {
            let weakness = {
              squares : [],
              pieces : [],
              weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN_COUPLE]
            }
            weakness.squares.push(ip)
            weakness.pieces.push(p[0])
            weakness.pieces.push(p[0])
            isolatedPawnCouples.push(weakness)
            pawnsSquares.forEach(s => {
              if(s[0] == 'g') {
                weakness.squares.push(s)
                ipcFound.push(s)
              }
            })
          }
        } else {
          if(columnsWithPawn.indexOf(String.fromCharCode(column -1)) >-1 && columnsWithPawn.indexOf(String.fromCharCode(column + 1)) < 0 &&
          columnsWithPawn.indexOf(String.fromCharCode(column -2)) < 0
          ) {
            let weakness = {
              squares : [],
              pieces : [],
              weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN_COUPLE]
            }
            weakness.squares.push(ip)
            weakness.pieces.push(p[0])
            weakness.pieces.push(p[0])
            isolatedPawnCouples.push(weakness)
            pawnsSquares.forEach(s => {
              if(s[0] == String.fromCharCode(column -1)) {
                weakness.squares.push(s)
                ipcFound.push(s)
              }
            })
          } else {
            if(columnsWithPawn.indexOf(String.fromCharCode(column -1)) < 0 && columnsWithPawn.indexOf(String.fromCharCode(column + 1)) > -1 &&
            columnsWithPawn.indexOf(String.fromCharCode(column +2)) < 0
            ) {
            let weakness = {
              squares : [],
              pieces : [],
              weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN_COUPLE]
            }
            weakness.squares.push(ip)
            weakness.pieces.push(p[0])
            weakness.pieces.push(p[0])
            isolatedPawnCouples.push(weakness)
            pawnsSquares.forEach(s => {
              if(s[0] == String.fromCharCode(column + 1)) {
                weakness.squares.push(s)
                ipcFound.push(s)
              }
            })
          }
          }
        }
      }
    }

  })
  return isolatedPawnCouples;
}

export function findIsolatedPawns(pieces : PiecePosition, p, color, columnsWithPawn) {
  let pawnsSquares = pieces[p[0]]
  let isolatedPawnWeakness = []
  pawnsSquares.forEach(s=> {
    let column = s.charCodeAt(0)
    let file = Number.parseInt(s[1])
    let supportingSquares = []
    if(column == 97 && columnsWithPawn.indexOf('b') < 0) {
      let weakness = {
        square : s,
        piece : p[0],
        weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN]
      }
      isolatedPawnWeakness.push(weakness)
    } else {
      if(column == 104 && columnsWithPawn.indexOf('g') < 0) {
        let weakness = {
          square : s,
          piece : p[0],
          weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN]
        }
        isolatedPawnWeakness.push(weakness)
      } else {
        if(columnsWithPawn.indexOf(String.fromCharCode(column - 1)) < 0 && columnsWithPawn.indexOf(String.fromCharCode(column + 1))< 0 ) {
          let weakness = {
            square : s,
            piece : p[0],
            weakness : WEAKNESS[WEAKNESS.ISOLATED_PAWN]
          }
          isolatedPawnWeakness.push(weakness)
        }
      }
    }



  })
  return isolatedPawnWeakness;
}


export function findDoublePawns(pieces : PiecePosition, p, color) {
  //calculate WEAKNESSES.DOUBLED_PAWN
  let doublePawnWeaknesses = []
  let pawnsSquares = pieces[p[0]]
  let columns = {}
  pawnsSquares.forEach(s=> {
    if(columns[s[0]]) {
      columns[s[0]].push(s)
    } else {
      columns[s[0]] = []
      columns[s[0]].push(s)
    }
  })
  Object.keys(columns).forEach(c=> {
    if(columns[c].length == 2) {
      let weakness = {
        squares : columns[c],
        piece : p[0],
        weakness : WEAKNESS[WEAKNESS.DOUBLED_PAWN]
      }
      doublePawnWeaknesses.push(weakness)
    } else {
      if(columns[c].length >= 3) {
        let weakness = {
          squares : columns[c],
          piece : p[0],
          weakness : WEAKNESS[WEAKNESS.DOUBLED_PAWN]
        }
        doublePawnWeaknesses.push(weakness)
      }
    }
  })
  return doublePawnWeaknesses;
}

export function loosingPiece(line : PrimaryLine, pieces : PiecePosition, color : ChessColors, squarePieceMap, chess : ChessJS.Chess) {
  let colorStr = color == ChessColors.white ? "w" :"b"
  line.moves.forEach(m=> {
    if(chess.turn() != colorStr) {
      let move = chess.move(m);
      let attacking = []
      Object.keys(squarePieceMap).forEach(p=> {
        if(color == ChessColors.white) {
          if(squarePieceMap[p]+"".charCodeAt(0) <=  MAX_BLACK_PIECE_INT && squarePieceMap[p]+"".charCodeAt(0) >=  MIN_BLACK_PIECE_INT) {
            //chess.atta
          }
        }

      })
    }
  })
}

export function testExtendedFunctionalities(fen : string, color : ChessJS.Color, square : ChessJS.Square) {
  let chess = new ChessJS.Chess(fen);
  return chess.getAttackedSquares({
    legal : true,
      square : square,
      color : color
  })
}
