import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { MoveDetails } from 'src/app/models/move';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';

@Component({
  selector: 'app-game-list-box',
  templateUrl: './game-list-box.component.html',
  styleUrls: ['./game-list-box.component.scss']
})
export class GameListBoxComponent implements OnInit {

  @Input()
  title : string | undefined

  @Input()
  games : Game[] | undefined
  constructor() { }

  gamesModeClass = "active"
  movesModeClass = ""
  currentMode = "games";

  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  movesMapReady : boolean = false;
  fenMoveMap = {}
  currentMovesArray : MoveDetails[] = []

  ngOnInit(): void {
    if(this.games && this.games.length > 0) {
      this.games.forEach(game=> {
        this.chess.reset();
        game.moves.forEach(move=> {
          let fen = this.chess.fen();
          if(!this.fenMoveMap[fen]) {
            this.fenMoveMap[fen] = []
          }
          let moveFound = false;
          this.fenMoveMap[fen].forEach(element => {
            if(element.move == move.move) {
              moveFound = true;
              switch(game.result) {
                case "1-0" :
                  element.whiteWins += 1
                  break;
                case "0-1" :
                  element.blackWins += 1
                  break;
                case "1/2" :
                  element.draws += 1
                  break
              }
              element.count += 1;
            }
          });
          if(!moveFound) {
            let moveDetails : MoveDetails = {
              move : move.move,
              whiteWins : 0,
              blackWins : 0,
              draws : 0,
              count : 1
            }
            switch(game.result) {
              case "1-0" :
                moveDetails.whiteWins = 1
                break;
              case "0-1" :
                moveDetails.blackWins = 1
                break;
              case "1/2" :
                moveDetails.draws = 1
                break
            }
            this.fenMoveMap[fen].push(moveDetails);
          }
          this.chess.move(move.move);
        })
      })
      this.chess.reset();
      this.movesMapReady = true;
      this.currentMovesArray = this.fenMoveMap[this.chess.fen()];
    }
  }

  setMode(mode : string) {
    this.currentMode = mode;
    if(this.currentMode == "games") {
      this.gamesModeClass = "active"
      this.movesModeClass = ""
    } else {
      this.gamesModeClass = ""
      this.movesModeClass = "active"
    }
  }

  onMoveSelect(event : string, board : ChessBoardComponent) {
    this.chess.move(event);
    let fen = this.chess.fen();
    this.currentMovesArray = this.fenMoveMap[fen];
    board.makeMove(event)
  }
}

