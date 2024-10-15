import { Component, OnInit } from '@angular/core';
import * as ChessJS from 'src/app/util/chessjs/chess';
@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();

  constructor() { }

  ngOnInit(): void {

  }

  play(textArea) {
    let fens =  [];
    let pgn = textArea.value;
    this.chess.loadPgn(pgn, {sloppy: true});
    let count = 0;
    let moves = this.chess.history() as string[];
    this.chess.reset();
    for(let index = 0; index < moves.length;index++ ) {
      let m = moves[index];
      if(m.indexOf("x") > 0){
        let square = m.substr(m.indexOf("x") + 1) as ChessJS.Square;
        let piece = this.chess.get(square);
        if(piece.type == 'q') {
          let isSacrifice = this.checkSacrifice(moves, index, piece);
          if(isSacrifice) {
            break;
          } else {
          }
        }
      }
      this.chess.move(moves[index]);
    }
    fens.push(this.chess.fen())
    while(this.chess.undo() != null && count < 100 ) {
      fens.push(this.chess.fen())
      count++;
    }
  }


  checkSacrifice(moves: string[], moveCount: number, piece : ChessJS.Piece) {
    let checkForNextNMoves = 4;
    this.chess.move(moves[moveCount]);
    for(let jIndex = moveCount+1;jIndex < moveCount + checkForNextNMoves; jIndex+=2) {
      let move = moves[jIndex];
      if(move.indexOf('x') > 0) {
        let square = move.substring(move.indexOf('x') + 1) as ChessJS.Square;
        let capturedPiece = this.chess.get(square);
        if(capturedPiece == piece)
          return false;
      }
      this.chess.move(moves[jIndex])
      this.chess.move(moves[jIndex+1])
    }
    for(let index=0; index < checkForNextNMoves; index++) {
        this.chess.undo();
    }
    return true;
  }

}



