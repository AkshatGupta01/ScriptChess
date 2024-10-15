import { Component, OnInit } from '@angular/core';
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
import { getStockfishPath } from 'src/app/util/stockfish-util';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';

declare function drawArrowBetweenSquare(s1,s2,id) : any
declare function removeAllSquareConnectingArrow(id) : any
@Component({
  selector: 'app-game-evaluator',
  templateUrl: './game-evaluator.component.html',
  styleUrls: ['./game-evaluator.component.scss']
})
export class GameEvaluatorComponent implements OnInit {

  game : Game | undefined;
  movePairs : any[] = []
  showBlackCommentIndex = 0;
  showWhiteCommentIndex = 0
  gameId : string | undefined;

  gamePgnStr : string | undefined;

  moveIndex = 0;

  moveMode : boolean = true;

  boardId : string | undefined
  currentFen : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  gameLoaded : false;
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  chessForEngine = new this.Chess();
  chessForEvaler = new this.Chess();
  loadingGame = false;
  engineWorker : any;
  analyzerWorker : any;
  currentGame : Game;
  bestMovesFound : number = 0
  evalsFound : number = 0
  evalerRunning = false;
  engineRunning = false;
  engineDepth = 18;
  avgTimePerDepth = "1 sec";
  startedAt = 0;
  completedAt = 0;
  annotationOverlay : any;
  score = 0+"%";
  engineElo = 0;

  BLUNDER = 2;
  DUBIOUS = 0.5;
  MISTAKE = 1.99;

  BEST = 0.3;
  BRILLIANT = 0.5;
  GOOD_MOVE = 0.2; //goes in negative and positive both mean the range is from +.2 to -.2

  bestMovesCount: number = 0
  goodMovesCount: number = 0
  mistakeMovesCount: number = 0
  blunderMovesCount: number = 0
  bookMovesCount: number = 0
  dubiousMovesCount: number = 0
  brilliantMoveCount : number = 0
  deviationFromDb : number = 0
  timeTaken : number
  currentPgn : string
  isSideMove : boolean = false;
  currentBestMove : string
  currentBestEval : string
  sideMove : string
  sideMoveCat : string
  sideMoveEval : string
  playedMoves: string[] = []
  allowPlay : boolean = false;
  engineFen: string;
  analysisFen: string;
  fenAnalysisMap : any= {}
  fenOnBoard : string;
  lastFen : string;
  selectedTab = new FormControl(0);
  gameAnalysisProgess = 0;
  analysisRunning : boolean = false;
  fenStr : string;
  isFenMode = false;
  engineRegistered = false;
  board : ChessBoardComponent

  constructor(private service : ScriptChessServiceService, private snackBar : MatSnackBar, private analyticService : AnalyticsService) {
    this.boardId = generateRandomID(5).trim();
  }

  ngOnInit(): void {
    //this.registerGameAnalyzer();
    this.registerStockFish();
    this.chanegEnginDepth(this.engineDepth)
  }



  chanegEnginDepth(event) {
    if(this.engineDepth <= 5) {
      this.avgTimePerDepth = "2 sec"
      this.engineElo = 1966
      return
    }

    if(this.engineDepth <= 10) {
      this.avgTimePerDepth = "20 sec"
      this.engineElo = 2231
      return
    }

    if(this.engineDepth <= 15) {
      this.avgTimePerDepth = "1 min"
      this.engineElo = 2563
      return
    }

    if(this.engineDepth <= 18) {
      this.avgTimePerDepth = "6 min"
      this.engineElo = 2761
      return
    }

    if(this.engineDepth <= 20) {
      this.avgTimePerDepth = "10 min"
      this.engineElo = 2894
      return
    }
  }

  onNoMove() {
    this.deviationFromDb = this.moveIndex /2;
    if(this.moveIndex %2 > 0) {
      this.deviationFromDb++;
    }
  }


  onMove(moveDetail : any, board : any) {
    let movesPlayedCount = this.playedMoves.length;
    if(!this.isSideMove) {
      let isWhite = movesPlayedCount % 2 == 0 ? true : false;
      if(this.currentGame.moves[movesPlayedCount].move == moveDetail.move.san) {
        this.makeMove(this.currentGame.moves[movesPlayedCount], isWhite, board, true)
        this.isSideMove = false;
      } else {
        this.isSideMove = true;
        if(!this.currentGame.moves[movesPlayedCount].sideMoves) {
          this.currentGame.moves[movesPlayedCount].sideMoves = []
        }
        let sideMove : Move = {
          move : moveDetail.move.san,
          moveNumber : 0,
          isSideMove : true
        }
        this.runStockFishForFen(board.getFen())
        this.sideMove = moveDetail.move.san
        this.currentGame.moves[movesPlayedCount].sideMoves.push(sideMove)
        this.selectedTab.setValue(1)
      }
    } else {
      this.isSideMove = true;
      let sideMove : Move = {
        move : moveDetail.move.san,
        moveNumber : 0,
        isSideMove : true
      }
      this.sideMove = moveDetail.move.san
      if(!this.currentGame.moves[movesPlayedCount].sideMoves) {
        this.currentGame.moves[movesPlayedCount].sideMoves = []
      }
      this.currentGame.moves[movesPlayedCount].sideMoves.push(sideMove)
      this.runStockFishForFen(board.getFen())
      this.selectedTab.setValue(1)
    }
    let tmpfen = this.chess.fen();
    if(this.isSideMove) {

      if(!this.fenAnalysisMap[tmpfen] && this.currentGame.moves[this.moveIndex].sideMoves.length == 1) {
        this.fenAnalysisMap[tmpfen] = {};
        if(this.currentGame.moves.length > this.moveIndex) {
          this.fenAnalysisMap[tmpfen].bestMove = this.currentGame.moves[this.moveIndex].bestMove
          this.fenAnalysisMap[tmpfen].bestEval = this.currentGame.moves[this.moveIndex].bestEval
        }
      }
    }
    this.lastFen = tmpfen;
    this.chess.move(moveDetail.move);
  }


  prepareGame(game : Game) {
    let movePair : any = {};
    for(let index = 1; index <= game.moves.length; index++) {
      if(index % 2 != 0) {
        movePair = {}
        movePair["white"] = this.game.moves[index -1]
      } else {
        movePair["black"] = this.game.moves[index -1]
        this.movePairs.push(movePair)
        movePair = null;
      }
    }
    if(movePair) {
      this.movePairs.push(movePair)
    }
  }

  showBlackComment(move : any) {
    if(this.showBlackCommentIndex > 0 && this.showBlackCommentIndex == move.moveNumber) {
      this.showBlackCommentIndex = 0
    } else {
      this.showWhiteCommentIndex = 0;
      this.showBlackCommentIndex = move.moveNumber
    }
  }

  showWhiteComment(move : any) {
    if(this.showWhiteCommentIndex > 0 && this.showWhiteCommentIndex == move.moveNumber) {
      this.showWhiteCommentIndex = 0
    } else {
      this.showWhiteCommentIndex = move.moveNumber;
      this.showBlackCommentIndex = 0;
    }
  }

  movePrev(board : ChessBoardComponent) {
    if(this.moveIndex == 0)
      return;

    board.undoMove();

    this.chess.undo();
    this.engineFen = this.chess.fen();
    let undoneMove = this.chess.undo();
    this.lastFen = this.chess.fen();
    this.chess.move(undoneMove);
    let movesPlayedCount = this.playedMoves.length;
    if(this.isSideMove){
      this.currentGame.moves[movesPlayedCount].sideMoves.pop();
      if(this.currentGame.moves[movesPlayedCount].sideMoves.length > 0)
        this.sideMove = this.currentGame.moves[movesPlayedCount].sideMoves[this.currentGame.moves[movesPlayedCount].sideMoves.length -1].move;
    } else {
      this.playedMoves.pop();
      this.moveIndex--;
    }
    this.isSideMove = this.currentGame.moves[movesPlayedCount].sideMoves.length > 0;
    removeAllSquareConnectingArrow(this.boardId);
  }

  moveNext(board : ChessBoardComponent) {
    if(this.engineRunning) {
      this.snackBar.open("Let the evaluation complete", "close")
      return;
    }
    if(this.isSideMove)
      return
    this.allowPlay = true;
    let isWhite = this.moveIndex % 2 == 0 ? true : false;
    if(this.game.moves.length > this.moveIndex) {
      let move = this.game.moves[this.moveIndex];
      this.makeMove(move, isWhite, board);
    }
  }

  makeMove(move : Move, isWhite : boolean, board : any, playedOnBoard : boolean = false) {
    if(this.engineRunning) {
      this.snackBar.open("Let the evaluation complete", "close")
      return;
    }

    this.allowPlay = true;
    if(!playedOnBoard)
      this.isSideMove = false;
    this.lastFen = this.chess.fen();

    let seqMoveIndex = isWhite ? (move.moveNumber * 2) - 1 : move.moveNumber * 2

    if(seqMoveIndex == (this.moveIndex + 1)) {
      //this is next move
      if(!playedOnBoard)
        board.makeMove(move.move);
      this.playedMoves.push(move.move);
      this.chess.move(move.move)
    } else {
      let moves : string[] = []
      this.playedMoves = [];
      this.chess.reset()
      for(let i = 0; i < seqMoveIndex; i++) {
        moves.push(this.game.moves[i].move);
        this.playedMoves.push(this.game.moves[i].move)
        this.chess.move(this.game.moves[i].move)
      }
      board.makeMoves(moves);
    }
    this.moveIndex = seqMoveIndex;
    if(move.comment) {
      if(isWhite) {
        this.showWhiteComment(move)
      } else {
        this.showBlackComment(move)
      }
    }
    this.moveIndex = seqMoveIndex
    let moveContainerElement = document.getElementsByClassName("moves-items")[0];
    let elements = moveContainerElement.getElementsByClassName("activeMove");
    if(elements.length > 0) {
      this.scrollParentToChild(moveContainerElement, elements[0])
    }
    this.currentFen = board.getFen();
    this.score = this.currentGame.moves[seqMoveIndex-1].eval;

    if(this.currentGame.moves.length > seqMoveIndex && this.currentGame.moves[seqMoveIndex].bestMove) {
      removeAllSquareConnectingArrow(this.boardId)
      drawArrowBetweenSquare(this.currentGame.moves[seqMoveIndex].bFrom, this.currentGame.moves[seqMoveIndex].bTo, this.boardId)
    }
    this.fenOnBoard = board.getFen();
  }

  scrollParentToChild(parent, child) {

    // Where is the parent on page
    var parentRect = parent.getBoundingClientRect();
    // What can you see?
    var parentViewableArea = {
      height: parent.clientHeight,
      width: parent.clientWidth
    };

    // Where is the child
    var childRect = child.getBoundingClientRect();
    // Is the child viewable?
    var isViewable = (childRect.top >= parentRect.top) && (childRect.bottom <= parentRect.top + parentViewableArea.height);

    // if you can't see the child try to scroll parent
    if (!isViewable) {
          // Should we scroll using top or bottom? Find the smaller ABS adjustment
          const scrollTop = childRect.top - parentRect.top;
          const scrollBot = parentRect.bottom / 2;
          if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
              // we're near the top of the list
              parent.scrollTop += scrollTop;
          } else {
              // we're near the bottom of the list
              parent.scrollTop += scrollBot;
          }
    }

  }

  setMoveMode(moveMode : boolean) {
    this.moveMode = moveMode;
  }

  registerStockFish() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.engineWorker = new Worker(new URL(getStockfishPath()));
      this.engineWorker.onmessage = ({ data }) => {
        if(this.isSideMove) {
          this.calculateSideMoveStatistic(data)
          return;
        }

        if(data && (data+"").startsWith("bestmove")) {
          if(this.currentGame.moves[this.bestMovesFound].moveCat == "3" || this.currentGame.moves[this.bestMovesFound].moveCat == "BOOK_MOVE") {
            this.bestMovesFound++;
            this.gameAnalysisProgess = (((this.bestMovesFound / this.currentGame.moves.length) * 100));
            this.runStockFishForFen(this.currentGame.moves[this.bestMovesFound -1].fen)
            return
          }

          let match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);

          this.chessForEngine = new this.Chess(this.engineFen);
          let move = this.chessForEngine.move({from: match[1], to: match[2], promotion: match[3]});
          if(move) {
            this.currentGame.moves[this.bestMovesFound].bestMove = move.san;
            this.currentGame.moves[this.bestMovesFound].bFrom = move.from;
            this.currentGame.moves[this.bestMovesFound].bTo = move.to;
            // if the move played matches with best move in the position, then it is the best move, no question asked
            if(this.currentGame.moves[this.bestMovesFound].move == move.san) {
              this.currentGame.moves[this.bestMovesFound].moveCat = MoveCategory.BEST.toString();
            } else {
              if(!this.currentGame.moves[this.bestMovesFound].comment) {
                this.currentGame.moves[this.bestMovesFound].comment = "";
              }
              this.currentGame.moves[this.bestMovesFound].comment = "Best move: " + move.san + this.currentGame.moves[this.bestMovesFound].comment;
            }
            this.bestMovesFound++;
            //this.moveIndex = this.bestMovesFound;
            this.gameAnalysisProgess = (((this.bestMovesFound / this.currentGame.moves.length) * 100));
            if(this.bestMovesFound == this.currentGame.moves.length) {
              this.bestMoveEvaluationCompleted();
            } else {
              this.runStockFishForFen(this.currentGame.moves[this.bestMovesFound -1].fen)
            }


          } else {
            if(!this.isSideMove) {
              console.error("Moves is out of sync")
            }
          }

        } else {
          let match = data.match(/^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/)
          if(match && this.bestMovesFound > 0) {
            var score = parseInt(match[3]) * (this.chessForEngine.turn() == 'w' ? 1 : -1);
            if(match[2] == 'cp') {
              //assign move the score.

              this.currentGame.moves[this.bestMovesFound -1].eval = (score / 100.0).toFixed(2); //This is the eval after this move is made
              this.currentGame.moves[this.bestMovesFound].bestEval = (score / 100.0).toFixed(2); //This will be eval if the best move is played
              //we will categroize this only if move is not a book move
              if(!this.currentGame.moves[this.bestMovesFound -1].moveCat
                || (this.currentGame.moves[this.bestMovesFound -1].moveCat != "3"
                && this.currentGame.moves[this.bestMovesFound -1].moveCat != "BOOK_MOVE"
                && this.currentGame.moves[this.bestMovesFound -1].moveCat != "BEST"
                && this.currentGame.moves[this.bestMovesFound -1].moveCat != "2")) {
                //Move categroization will not be possible for first two iteration as only one move from the game is played.
                //(bestMovesFound initialized before any move was played)
                //In most of the case first move is bookmove anyway. So hopefully we will never step into this if
                if(this.bestMovesFound < 2)
                  return;
                //Move categorization depends upon the difference of eval of current and last move.
                //The difference can only be taken when no mate is found between current and last move, as mate is string and we need number.
                //mate case will be handled separately
                //also we will be categorizing move on index (bestMovesFound -1) as bestMovesFound initialized before any move was played

                if(!this.currentGame.moves[this.bestMovesFound -1].eval.startsWith("M")  && !this.currentGame.moves[this.bestMovesFound -2].eval.startsWith("M")) {
                  let currentEval = Number.parseFloat(this.currentGame.moves[this.bestMovesFound -1].eval);
                  let lastEval = Number.parseFloat(this.currentGame.moves[this.bestMovesFound -2].eval);
                  let diff = currentEval - lastEval;

                  //compute the turn
                  let chessForEngine = new this.Chess(this.currentGame.moves[this.bestMovesFound -1].fen);
                  let turn = chessForEngine.turn();
                  // if the current fen denotes move of white then we will have to judge this from black's perspective, as this fen is reached by black's move
                  turn = turn == 'w' ? 'b' : 'w';
                  let badMove = false;
                  //if last move was made by white then it will be bad move only if the difference is negative and vice versa
                  if(turn == 'w') {
                    badMove = diff < 0
                  } else {
                    badMove = diff > 0
                  }
                  if(badMove) {
                    //take the absolute value of diff in order to compare this with category range
                    diff = Math.abs(diff)
                    if(diff >= this.BLUNDER) {
                      this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.BLUNDER.toString()
                    } else {
                      if(diff >= this.MISTAKE) {
                        this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.MISTAKE.toString()
                      } else {
                        if(diff >= this.DUBIOUS) {
                          this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.DUBIOUS.toString()
                        } else {
                          if(diff < this.DUBIOUS) {
                            this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.GOOD_MOVE.toString()
                          }
                        }
                      }
                    }
                  } else {
                    //it's not a bad move
                    if(diff > this.BRILLIANT) {
                      this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.BRILLIANT.toString()
                    } else {
                      this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.BEST.toString()
                    }
                  }
                } else if(this.currentGame.moves[this.bestMovesFound -2].eval.startsWith("M")){
                  let currentEval = Number.parseFloat(this.currentGame.moves[this.bestMovesFound].eval)
                  if(currentEval >25) {
                    this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.MISTAKE.toString()
                  } else {
                    this.currentGame.moves[this.bestMovesFound -1].moveCat = MoveCategory.BLUNDER.toString()
                  }
                }

              }
            /// Did it find a mate?
            } else if(match[2] == 'mate') {
              if(score > 0)
                this.currentGame.moves[this.bestMovesFound - 1].eval = '+M' + score;
              else
                this.currentGame.moves[this.bestMovesFound - 1].eval = '-M' + Math.abs(score);

              if(!this.currentGame.moves[this.bestMovesFound - 1].moveCat) {
                this.currentGame.moves[this.bestMovesFound - 1].moveCat = MoveCategory.GOOD_MOVE.toString()
              }
            }
            //calculate variations
            let pv : string = match[4];
            if(pv && pv.trim().length > 0 && this.bestMovesFound > 0) {
              if(!this.currentGame.moves[this.bestMovesFound].candidateLines) {
                this.currentGame.moves[this.bestMovesFound].candidateLines = new PrimaryLines();
              }
              this.currentGame.moves[this.bestMovesFound].candidateLines.setDepth(match[1])
              let lans = pv.split(" ");
              let lanToSanChess = new this.Chess(this.engineFen);
              let pvMoves = []
              lans.forEach(lan=> {
                let moveMatch = lan.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
                if(moveMatch) {
                  let sanMove = lanToSanChess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
                  pvMoves.push(sanMove.san)
                }
              })
              if(pvMoves.length > 0) {
                if(match[2] == 'cp') {
                  let pvEval = (score / 100.0).toFixed(2)
                  this.currentGame.moves[this.bestMovesFound].candidateLines.pushLine(new PrimaryLine(pvEval, pvMoves));
                } else if(match[2] == 'mate') {
                  if(score > 0)
                    this.currentGame.moves[this.bestMovesFound].candidateLines.pushLine(new PrimaryLine('+M' + score, pvMoves));
                  else
                    this.currentGame.moves[this.bestMovesFound].candidateLines.pushLine(new PrimaryLine('-M' + Math.abs(score), pvMoves));
                }
              }
            }
          }
          if(data === "uciok") {
            this.engineRegistered = true;
          }
        }
      };
      this.engineWorker.postMessage("uci")
      //this.engineWorker.postMessage("setoption name Use NNUE value true")

    }
  }

  calculateSideMoveStatistic(data : string) {
    if(data && (data+"").startsWith("bestmove")) {
      let match = data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
      if(match) {
        this.chessForEngine = new this.Chess(this.engineFen);
        let move = this.chessForEngine.move({from: match[1], to: match[2], promotion: match[3]});
        if(move) {
          this.fenAnalysisMap[this.engineFen].bestMove = move.san
          removeAllSquareConnectingArrow(this.boardId)
          drawArrowBetweenSquare(move.from, move.to, this.boardId);
        }
      }

    } else {
      let match = data.match(/^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/)
      if(match) {
        let depth = match[1];
        let score = ""
        let tmpEval = (parseInt(match[3]) * (this.chessForEngine.turn() == 'w' ? 1 : -1));
        if(match[2] == 'cp') {
          score = (tmpEval / 100.0).toFixed(2)

        } else if(match[2] == 'mate') {
          if(tmpEval > 0)
                score = '+M' + tmpEval;
              else
              score = '-M' + Math.abs(tmpEval);
        }

        let pv : string = match[4];
        if(pv && pv.trim().length > 0) {
          let lans = pv.split(" ");
          let lanToSanChess = new this.Chess(this.engineFen);
          let pvMoves = []
          lans.forEach(lan=> {
            let moveMatch = lan.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
            if(moveMatch) {
              let sanMove = lanToSanChess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
              pvMoves.push(sanMove.san)
            }
          })
          if(pvMoves.length >0){
            if(!this.fenAnalysisMap[this.engineFen])
              this.fenAnalysisMap[this.engineFen] = {}
            if(!this.fenAnalysisMap[this.engineFen].candidateLines) {
              this.fenAnalysisMap[this.engineFen].candidateLines = new PrimaryLines();
            }
            this.fenAnalysisMap[this.engineFen].eval = score;
            this.fenAnalysisMap[this.engineFen].candidateLines.setDepth(match[1])
            this.fenAnalysisMap[this.engineFen].candidateLines.pushLine(new PrimaryLine(score, pvMoves));
            if(this.lastFen && this.fenAnalysisMap[this.lastFen]) {
              this.fenAnalysisMap[this.lastFen].bestEval = score;
            } else {
              return;
            }



            //sidemove Categorization
            let bestEval = Number.parseFloat(this.fenAnalysisMap[this.lastFen].bestEval);
            let currentEval = Number.parseFloat(this.fenAnalysisMap[this.lastFen].eval);
            let diff = currentEval - bestEval;
            let turn = this.chessForEngine.turn();
            let badMove = false;
            //since we are evaluating last move. If it's white turn that mean move is evalutated for black
            if(turn == 'w') {
              badMove = diff > 0
            } else {
              badMove = diff < 0
            }
            if(badMove) {
              diff = Math.abs(diff)
              if(diff >= this.BLUNDER) {
                this.fenAnalysisMap[this.lastFen].moveCat = MoveCategory.BLUNDER.toString()
              } else {
                if(diff >= this.MISTAKE) {
                  this.fenAnalysisMap[this.lastFen].moveCat = MoveCategory.MISTAKE.toString()
                } else {
                  if(diff >= this.DUBIOUS) {
                    this.fenAnalysisMap[this.lastFen].moveCat = MoveCategory.DUBIOUS.toString()
                  } else {
                    if(diff <= this.GOOD_MOVE) {
                      this.fenAnalysisMap[this.lastFen].moveCat = MoveCategory.GOOD_MOVE.toString()
                    }
                  }
                }
              }
            } else {
              if(diff > this.BRILLIANT) {
                this.fenAnalysisMap[this.lastFen].moveCat = MoveCategory.BRILLIANT.toString()
              } else {
                this.fenAnalysisMap[this.lastFen].moveCat = MoveCategory.BEST.toString()
              }
            }
          }
        }

      }
    }
  }
  bestMoveEvaluationCompleted() {
    this.completedAt = new Date().getTime();
    this.moveIndex = 0;
    this.engineRunning = false;
    this.score = "0.2"
    this.isSideMove = false;
    this.timeTaken = (this.completedAt - this.startedAt) / 1000;
    this.analysisRunning = false;
    this.currentGame.moves.forEach(move=> {
      switch(move.moveCat) {
        case "BOOK_MOVE":
        case "3":
          this.bookMovesCount++;
          break;
        case "BEST":
        case "2":
          this.bestMovesCount++;
          break;
        case "DUBIOUS":
        case "4":
          this.dubiousMovesCount++;
          break;
        case "BLUNDER":
        case "6":
          this.blunderMovesCount++;
          break;
        case "GOOD_MOVE":
        case "1":
          this.goodMovesCount++;
          break;
        case "BRILLIANT":
        case "0":
          this.brilliantMoveCount++;
          break;
      }
    })

  }

  registerGameAnalyzer() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.analyzerWorker = new Worker(new URL(getStockfishPath()));
      this.analyzerWorker.onmessage = ({data}) => {
        if(data && (data+"").startsWith("Final evaluation")) {
          let match = data.match(/^Final evaluation.* ([\+\-\.0-9].*).*/);
          if(match) {
            this.currentGame.moves[this.evalsFound].eval = match[1].replace("(white side)","").replace("(black side)","").trim();
            this.evalsFound++;
          }
        }

      };
      this.analyzerWorker.postMessage("uci")
    }
  }

  onPgnEnter(pgn : string) {
    this.currentPgn = pgn;
    this.score = "0.0"
    this.moveIndex = 0;
    this.loadingGame = true;
    if(this.chess.loadPgn(pgn)) {
      this.service.parsePgn(pgn).subscribe(response=> {
        if(response && response.body && response.body.length > 0) {
          this.game = response.body[0];
          this.prepareGame(this.game)
          this.loadingGame = false;
          this.analyzeGame(this.game);
        }
      })
      this.analyticService.recordPgnPlayerUsed();

    } else {
      this.snackBar.open("PGN seems to be invalid", "close")
    }


  }

  newPgn() {
    this.game = null;
  }

  runStockFishForFen(fen : string) {
    this.sendStopToStockfish();
    this.analysisFen = fen;
    this.engineFen = fen;
    this.engineWorker.postMessage('position fen ' + fen);
    this.engineWorker.postMessage(`go depth ` + this.engineDepth)
  }

  sendStopToStockfish() {
    this.engineWorker.postMessage('stop');
  }

  analyzeGame(game : Game) {
    this.startedAt = new Date().getTime();
    this.currentGame = game;
    this.chess.reset();
    this.currentGame.moves.forEach(move=> {
      let cMove = this.chess.move(move.move);
      move.fen = this.chess.fen();
      move.from = cMove.from
      move.to = cMove.to
    })
    this.chess.reset();
    this.chessForEngine.reset();
    this.runStockFishForFen(this.initialFen)
    this.engineRunning = true;
    this.analysisRunning = true;
  }

  reRunAnalysis() {
    if(this.engineRunning) {
      this.snackBar.open("Let the analysis complete")
      return;
    }
    this.onPgnEnter(this.currentPgn);
  }

  getSliderTickInterval(): number | 'auto' {
    return 1;
  }

  onFenEnter(fen) {
    this.fenStr = fen;
    this.isSideMove = true;
    if(this.engineRegistered)
      this.runStockFishForFen(fen);
    else{
      while(!this.engineRegistered) {
        setTimeout(()=>{}, 2000)
      }
      this.runStockFishForFen(fen);
    }
    this.isFenMode = true;
    if(this.board) {
      this.board.loadFen(fen);
    }
  }

}
