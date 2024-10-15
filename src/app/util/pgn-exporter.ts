import { ChessColors } from "../models/board.config";
import { Move } from "../models/move";

export function exportPgn (moves : Move[], result : string, initialPosition : string) : string {
  let pgnFormat = "";
  if(initialPosition == "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1") {
    pgnFormat = `[Event \"Game analysis on Scriptchess.com\"]
    [Site \"scriptchess.com\"]
    [White \"?\"]
    [Black \"?\"]
    [Result \"{result}\"]

    {pgn} {result}`
  } else {
    pgnFormat = `[Event \"Game analysis on Scriptchess.com\"]
    [Site \"scriptchess.com\"]
    [White \"?\"]
    [Black \"?\"]
    [Result \"{result}\"]
    [FEN \"{fen}\"]
    {pgn} {result}`
  }
    let pgn = "";
    moves.forEach(move=> {
        let moveNumber = move.playedBy == ChessColors.white ? move.moveNumber+"." : move.moveNumber+"...";
        pgn = pgn + " " + moveNumber + " " +move.move;
        if(move.comment) {
            if(!move.comment.startsWith("{")) {
              pgn = pgn + " {" + move.comment + "} ";
            } else {
              pgn = pgn + move.comment;
            }

        }
        if(move.sideMovesArray) {
            pgn = pgn + createCommentFromSideMoves(move);
        }
    })
    pgnFormat = pgnFormat.replace("{result}", result).replace("{result}", result).replace("{pgn}", pgn).replace("{fen}", initialPosition);
    return pgnFormat;
}

function createCommentFromSideMoves(moveWithSideMove : Move) : string {

    if(moveWithSideMove.sideMovesArray) {
        let completeComment = "";
        moveWithSideMove.sideMovesArray.forEach(sidemoves=> {
            let comment : string = "(";
            sidemoves.forEach(move=> {
                let moveNumber = move.playedBy == ChessColors.white ? move.moveNumber+"." : move.moveNumber+"..";
                comment = comment + " " +moveNumber + " " + move.move
                if(move.comment) {
                    comment = comment + "{" + move.comment + "}";
                }
                if(move.sideMovesArray) {
                    comment = comment + createCommentFromSideMoves(move);
                }
            })
            completeComment = completeComment + " " + comment+")";
        })
        return completeComment;

    } else {
        return "";
    }
}

function transform(value: string): string {
    switch(value) {
      case "BOOK_MOVE":
        return "book move";
      case "BEST":
        return "best move";
      case "DUBIOUS":
        return "dubious move";
      case "BLUNDER":
        return "blunder move";
      case "GOOD_MOVE":
        return "good move";
      case "BRILLIANT":
        return "brilliant move";
    }

    switch(value+"") {
      case "3":
        return "book move";
      case "1":
        return "good move";
      case "2":
        return "best move";
      case "4":
        return "dubious move";
      case "6":
        return "blunder move";
      case "0":
        return "brilliant move";
    }
    return null;
  }
