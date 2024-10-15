import * as ChessJS from 'src/app/util/chessjs/chess';
import { Chess } from 'src/app/util/chessjs/chess';
import { ColorBasedSupportMatrix, SquareDetails, SupportMatrix } from "../models/support-matrix";

export function getCoverageMatrix(chess, position) {
    let Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
    let bMatrix : SupportMatrix = {details : []};
    let wMatrix : SupportMatrix = {details : []};
    let dominance = {}
    let rank = [1,2,3,4,5,6,7,8];
    let file = ["a","b","c","d","e","f","g","h"];
    let squares = [];

    for(let i=0;i<8;i++) {
        for(let j=0;j<8;j++) {
            let square = file[j] + rank[i] ;
            dominance[square] = 0;
        }
    }
    let colorMatrix : ColorBasedSupportMatrix = {
        black : bMatrix,
        white : wMatrix
    }
    let squareDetails : SquareDetails[] = []
    let squaresWithPieces = Object.keys(position);
    squaresWithPieces.forEach(square=> {
        let piece = position[square];
        let color = piece.charAt(0);
        let detail : SquareDetails = {origin : square, attacking: [], supporting : [], supportedPiece : []}
        let sqaures = getSupportedSquares(chess, square, color);
        if(sqaures && sqaures.length > 0) {
            sqaures.forEach(s=> {
                if(!dominance[s]) {
                    dominance[s] = 0;
                }
                if(color == 'b') {
                    dominance[s] -= 1;
                } else {
                    dominance[s] += 1;
                }
                if(!position[s]) {
                    detail.supporting.push(s)
                } else {
                    if(position[s].charAt(1) == 'k' || position[s].charAt(1) == 'K')
                    {
                        //do nothing
                    } else {
                        if(position[s].charAt(0) == color) {
                            detail.supporting.push(s)
                            detail.supportedPiece.push(s);
                        } else {
                            detail.attacking.push(s);
                        }
                    }

                }
            })
        }
        if(color == 'w') {
            wMatrix.details.push(detail)
        } else {
            bMatrix.details.push(detail);
        }
    })
    colorMatrix.dominance = dominance;
    return colorMatrix;
}

function getSupportedSquares(chess, square, color) {
    let tmpChess = new Chess();
    tmpChess.load(chess.fen())
    let foundMoves = tmpChess.getSupportedSquares({
        legal : true,
        square : square,
        color : color

      })
    let moves=  []
    foundMoves.forEach(m=> {
        moves.push(m.to);
    })
    foundMoves = tmpChess.getAttackedSquares({
        legal : true,
        square : square,
        color : color
    })
    foundMoves.forEach(m=> {
        let to = m.to;
        if(moves.indexOf(to) < 0) {
            moves.push(to)
        }
    })
    return moves;
}

function strippedSan(move) {
    if(move.indexOf("=") > -1) {
        return move.substring(0, move.indexOf("="));
    }
    return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
}

export function isMove(san) {
    san = strippedSan(san);
    return san.match(/^[KQRBN]?[a-h]?[1-8]?x?[a-h][1-8]$/)
}

export function isMoveNumber(str) {
    return str.match(/^\d+[\.]{0,2}$/) != null
}
