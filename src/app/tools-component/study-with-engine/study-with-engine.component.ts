import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Move, MoveCategory, MoveDetails, PrimaryLine, PrimaryLines } from 'src/app/models/move';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generateRandomID } from 'src/app/util/strings';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { EcoModel } from 'src/app/models/eco';
import { ignoreElements } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ChessColors } from 'src/app/models/board.config';
import { getStockfishPath } from 'src/app/util/stockfish-util';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
@Component({
  selector: 'app-study-with-engine',
  templateUrl: './study-with-engine.component.html',
  styleUrls: ['./study-with-engine.component.scss']
})
export class StudyWithEngineComponent implements OnInit {

  @Input()
  initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  @Input()
  engineDepth = 18;


  playedBy : ChessColors


  engineElo = 0;

  boardId : string

  BLUNDER = 2;
  DUBIOUS = 0.5;
  MISTAKE = 1.99;

  BEST = 0.3;
  BRILLIANT = 0.5;
  GOOD_MOVE = 0.2;

  score = "0";

  currentFen : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  chessForEngine = new this.Chess();
  engineWorkerForUser : any;
  engineWorkerForEngine : any;
  engineRegisteredForUser: boolean;
  engineRegisteredForEngine: boolean;
  engineThinking : boolean;
  evaluationRunning : boolean
  board : ChessBoardComponent;
  playedMoves : Move[] = []
  movePairs = []
  lastBestMove : string;
  moveIndex = 0;
  constructor() {
    this.boardId = generateRandomID(5).trim();
  }

  ngOnInit(): void {
    this.registerStockFishForUser();
    //this.registerStockfishForEngine();
    this.currentFen = this.initialFen;
    this.chess = new this.Chess(this.currentFen);
    let turn = this.chess.turn();
    if(turn == "w")
      this.playedBy = ChessColors.white
    else
      this.playedBy = ChessColors.black
  }

  onMove(moveDetail, board) {
    if(!this.board) {
      this.board = board;
    }

    if(moveDetail) {
      let playedMove = this.chess.move(moveDetail.move.san);
      if(playedMove) {
        if(this.moveIndex != (this.playedMoves.length -1) && this.moveIndex < (this.playedMoves.length -1)) {
          if(playedMove.san == this.playedMoves[this.moveIndex + 1].move) {
            this.moveIndex++;
            let fen = this.chess.fen();
            this.currentFen = fen;
          } else {
            this.playedMoves = this.playedMoves.slice(0, this.moveIndex);
            let moveNumber = this.playedMoves.length / 2;
            if(moveNumber == 0) {
              moveNumber = 1
            } else {
              let lastMove = this.playedMoves[this.playedMoves.length -1];
              if(this.chess.turn() == "b") {
                moveNumber = lastMove.moveNumber + 1
              } else {
                moveNumber = lastMove.moveNumber
              }
            }
            let move : Move = {
              move : moveDetail.move.san,
              moveNumber : moveNumber
            }
            this.playedMoves.push(move)
            this.createMovePair(move)
            this.runStockFishForUserForFen(this.chess.fen());
          }
        } else {
          let fen = this.chess.fen();
          //this.runStockFishForEngineForFen(fen);
          this.moveIndex++;

          this.currentFen = fen;
          let moveNumber = this.playedMoves.length / 2;
          if(moveNumber == 0) {
            moveNumber = 1
          } else {
            let lastMove = this.playedMoves[this.playedMoves.length -1];
            if(this.chess.turn() == "b") {
              moveNumber = lastMove.moveNumber + 1
            } else {
              moveNumber = lastMove.moveNumber
            }
          }
          let move : Move = {
            move : moveDetail.move.san,
            moveNumber : moveNumber
          }
          if(this.lastBestMove && moveDetail.move.san == this.lastBestMove) {
            move.moveCat = MoveCategory.BEST.toString()
          }
          this.playedMoves.push(move)
          this.createMovePair(move)

          this.runStockFishForUserForFen(fen);
        }

      } else {
        console.error("out of sync")
        console.error("played moves: ")
        console.error(this.playedMoves)
        console.error(this.chess.history())
        console.error("sent move: " + moveDetail.move.san)
      }
    }
  }

  registerStockFishForUser() {
    if (typeof Worker !== 'undefined') {
      this.engineWorkerForUser = new Worker(new URL(getStockfishPath()));
      this.engineWorkerForUser.onmessage = ({ data }) => {

          //here goes engine's Operation
          if(data === "uciok") {
            if(!this.engineRegisteredForUser) {
              this.runStockFishForUserForFen(this.currentFen)
            }
            this.engineRegisteredForUser = true;
            return;
          } else {
            let match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            if(match) {
              //find best move
              let turn = this.chess.turn();
              let move = null;
              if(this.playedBy == ChessColors.white && turn == "b") {
                move = this.chess.move({from: match[1], to: match[2], promotion: match[3]});
                this.playMove(move);
                this.classifyLastMoveForUser(MoveCategory.BEST, move.san);
              } else {
                if(this.playedBy == ChessColors.black && turn == "w") {
                  move = this.chess.move({from: match[1], to: match[2], promotion: match[3]});
                  this.playMove(move);
                  this.classifyLastMoveForUser(MoveCategory.BEST, move.san);
                } else {
                  move = this.chess.move({from: match[1], to: match[2], promotion: match[3]});
                  this.chess.undo();
                  this.lastBestMove = move.san;
                  this.evaluationRunning = false;
                }
              }
              this.engineThinking = false;

            } else {
              let match = data.match(/^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/)
              if(match) {
                //evaluate score
                var tmpScore = parseInt(match[3]) * (this.chess.turn() == 'w' ? 1 : -1);
                if(match[2] == 'cp') {
                  tmpScore = (tmpScore / 100.0)
                  let turn = this.chess.turn();
                  let diff = tmpScore - Number.parseFloat(this.score);
                  if(match[1] == this.engineDepth+"")
                    this.score = tmpScore.toFixed(2);
                  if(turn == "w" && this.playedBy == ChessColors.white) {
                    return;
                  }
                  if(turn == "b" && this.playedBy == ChessColors.black) {
                    return;
                  }
                  let moveCat = null;

                  let badMove = false;
                  if(turn == 'b' && this.playedBy == ChessColors.white) {
                    //if it's black's turn then it means last move was made by white, hence if the diff is negative then it's bad move
                    if(diff < 0) {
                      badMove = true;
                    }
                  }
                  if(turn == 'w' && this.playedBy == ChessColors.black) {
                    //if it's white's turn then it means last move was made by black, hence if the diff is positive then it's bad move
                    if(diff > 0) {
                      badMove = true;
                    }
                  }

                  if(badMove) {
                    diff = Math.abs(diff)
                    if(diff >= this.BLUNDER) {
                      moveCat = MoveCategory.BLUNDER.toString()
                    } else {
                      if(diff >= this.MISTAKE) {
                        moveCat = MoveCategory.MISTAKE.toString()
                      } else {
                        if(diff >= this.DUBIOUS) {
                          moveCat = MoveCategory.DUBIOUS.toString()
                        } else {
                          if(diff < this.DUBIOUS) {
                            moveCat = MoveCategory.GOOD_MOVE.toString()
                          }
                        }
                      }
                    }
                  } else {
                    if(diff > this.BRILLIANT) {
                      moveCat = MoveCategory.BRILLIANT.toString()
                    } else {
                      moveCat = MoveCategory.BEST.toString()
                    }
                  }
                  this.classifyLastMoveForUser(moveCat, null)
                }
              }
            }

          }
      }
      this.engineWorkerForUser.postMessage("uci")
      this.engineWorkerForUser.postMessage("setoption name Use NNUE value true")
    }
  }


  classifyLastMoveForUser(moveCat, bestMove) {
    if(this.playedMoves.length == 0)
      return
    if(!bestMove) {
      let movePair = this.movePairs[this.movePairs.length -1]
      if(movePair["black"]) {
        if(movePair["black"].moveCat  != "2")
          movePair["black"].moveCat = moveCat
      } else {
        if(movePair["white"].moveCat  != "2")
          movePair["white"].moveCat = moveCat
      }

      //this.playedMoves[this.playedMoves.length -1].moveCat = moveCat;
    } else {
      let movePair = this.movePairs[this.movePairs.length -1]
      if(movePair["black"]) {
        if(movePair["black"].move == bestMove) {
          movePair["black"].moveCat = moveCat
        }
      } else {
        if(movePair["white"].move == bestMove) {
          movePair["white"].moveCat = moveCat
        }
      }

      let move = this.playedMoves[this.playedMoves.length -1]
      if(move.move == bestMove) {
        move.moveCat = moveCat
      }
    }

  }

  playMove(move: ChessJS.Move) {
    this.board.makeMove(move.san);
    let moveNumber = this.playedMoves.length / 2;
    if(moveNumber == 0) {
      moveNumber = 1
    } else {
      let lastMove = this.playedMoves[this.playedMoves.length -1];
      if(this.chess.turn() == "b") {
        moveNumber = lastMove.moveNumber + 1
      } else {
        moveNumber = lastMove.moveNumber
      }
    }
    let cMove : Move = {
      move : move.san,
      moveNumber : moveNumber
    }
    this.playedMoves.push(cMove)
    this.currentFen = this.chess.fen();
    this.createMovePair(cMove);
    this.moveIndex++;
    this.runStockFishForUserForFen(this.chess.fen())
  }

  createMovePair(move) {
    this.movePairs = [];
    let firstColor = "";
    let secondColor = "";
    firstColor = this.playedBy == ChessColors.white ? "white" : "black";
    secondColor = this.playedBy == ChessColors.white ? "black" : "white";
    for(let index = 0; index < this.playedMoves.length;) {
      let pair = {};
      if(this.playedMoves.length > index+1) {
        pair[firstColor] = this.playedMoves[index];
        pair[secondColor] = this.playedMoves[index+1];
        index+=2;
      } else {
        pair[firstColor] = this.playedMoves[index];
        index++;
      }
      this.movePairs.push(pair)
    }

  }

  runStockFishForUserForFen(fen : string) {
    this.sendStopToStockfish();
    this.engineWorkerForUser.postMessage('position fen ' + fen);
    this.engineWorkerForUser.postMessage(`go depth ` + this.engineDepth)
    let turn = this.chess.turn();
    if((turn == 'w' && this.playedBy == ChessColors.white) || (turn == 'b' && this.playedBy == ChessColors.black)) {
      this.evaluationRunning = true;
    } else {
        this.engineThinking = true;
    }

  }

  runStockFishForEngineForFen(fen : string) {
    this.sendStopToStockfish();
    this.engineWorkerForEngine.postMessage('position fen ' + fen);
    this.engineWorkerForEngine.postMessage(`go depth ` + this.engineDepth)
  }

  makeMove(move, isWhite, board) {
    let mIndex = 0;
    this.chess = new this.Chess(this.initialFen);
    if(this.movePairs.length >0) {
      for(let index = 0; index < this.movePairs.length; index++) {
        let pair = this.movePairs[index];
        mIndex++;
        if(isWhite && pair["white"].move == move.move && pair["white"].moveNumber == move.moveNumber) {
          break
        } else {
          mIndex++;
          if(!isWhite && pair["black"].move == move.move && pair["black"].moveNumber == move.moveNumber) {
            break
          }
        }
      }

      for(let index = 0; index < mIndex; index++) {
        this.chess.move(this.playedMoves[index].move)
      }
      this.currentFen = this.chess.fen();
      this.moveIndex = mIndex;
    }
  }

  sendStopToStockfish() {
    this.engineWorkerForUser.postMessage('stop');
  }
}
