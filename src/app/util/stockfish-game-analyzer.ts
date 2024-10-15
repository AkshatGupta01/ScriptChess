import { Move, MoveCategory, PrimaryLine, PrimaryLines } from "../models/move";
import * as ChessJS from 'src/app/util/chessjs/chess';
import { environment } from "src/environments/environment";
import { MovecatPipe } from "../pipes/movecat.pipe";
import { getStockfishPath } from "./stockfish-util";
export class StockfishGameAnalyzer {
    Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
    chess = new this.Chess();
    engineWorker : any
    engineRegistered: boolean;
    bestMovePatter = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/
    stalemateMove = "bestmove (none)"
    scorePattern = /^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/
    totalMoves : number
    currentMoveIndex = -1;
    currentFen = "";
    initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    BLUNDER = 2;
    DUBIOUS = 0.5;
    MISTAKE = 1.99;

    BEST = 0.3;
    BRILLIANT = 0.5;
    GOOD_MOVE = 0.2; //goes in negative and positive both mean the range is from +.2 to -.2
    constructor(private moves : Move[],private depth, private completionCallBack, private progressCallback, private caller : any = null) {
        this.totalMoves = moves.length;
        this.registerStockFish();
    }

    registerStockFish() {
        if (typeof Worker !== 'undefined') {
            this.engineWorker = new Worker(new URL(getStockfishPath()));
            this.engineWorker.onmessage = ({ data }) => {
                if(data === "uciok") {
                    this.engineRegistered = true;
                    this.runGameAnalysis();
                  } else {
                    if(data == this.stalemateMove) {
                      this.completionCallBack(this.moves, this.caller)
                    }
                    //check for best move
                    let match = data.match(this.bestMovePatter);
                    if(match) {
                        //this is best move
                        let chessForEngine = new this.Chess(this.currentFen);
                        let move = chessForEngine.move({from: match[1], to: match[2], promotion: match[3]});
                        let bestMove = ""
                        if(move) {
                            bestMove = move.san;
                        }
                        if(this.moves[this.currentMoveIndex].moveCat == MoveCategory.BOOK_MOVE.toString() || this.moves[this.currentMoveIndex].moveCat == "BOOK_MOVE") {
                            //go for next
                            if(this.moves.length > this.currentMoveIndex) {
                              if(this.caller)
                                this.progressCallback(this.currentMoveIndex+1, this.caller)
                              else
                                this.progressCallback(this.currentMoveIndex+1)
                              this.runGameAnalysis()
                            } else {
                              this.engineWorker.terminate()
                              if(this.caller)
                                this.completionCallBack(this.moves, this.caller)
                              else
                                this.completionCallBack(this.moves)
                                this.engineWorker.terminate();
                            }
                        } else {
                            if(move) {
                                if(this.moves.length > this.currentMoveIndex) {
                                    if(this.moves[this.currentMoveIndex+1]) {
                                        if(this.moves[this.currentMoveIndex + 1].move == bestMove) {
                                            this.moves[this.currentMoveIndex + 1].moveCat = MoveCategory.BEST.toString();
                                        } else {
                                            if(this.moves[this.currentMoveIndex + 1].moveCat == MoveCategory.BEST.toString()) {
                                                this.moves[this.currentMoveIndex + 1].comment= "Alternate " + bestMove
                                            } else {
                                                this.moves[this.currentMoveIndex + 1].comment= "Best move " + bestMove
                                                this.moves[this.currentMoveIndex + 1].bestMove= bestMove
                                            }

                                        }

                                        if(this.caller)
                                          this.progressCallback(this.currentMoveIndex+1, this.caller)
                                        else
                                          this.progressCallback(this.currentMoveIndex+1)
                                        this.runGameAnalysis()
                                    } else {
                                      if(this.caller)
                                        this.progressCallback(this.currentMoveIndex+1, this.caller)
                                      else
                                        this.progressCallback(this.currentMoveIndex+1)
                                        this.runGameAnalysis()
                                    }
                                } else {
                                    //analysis is complete
                                    this.engineWorker.terminate();
                                    if(this.caller)
                                      this.completionCallBack(this.moves, this.caller)
                                    else
                                      this.completionCallBack(this.moves)
                                }

                            }

                        }

                    } else {
                        let match = data.match(this.scorePattern);
                        if(match) {
                            //calculate and assign score
                            let chessForEngine = new this.Chess(this.currentFen);
                            var tmpScore = parseInt(match[3]) * (chessForEngine.turn() == 'w' ? 1 : -1);
                            if(match[2] == 'cp') {
                                tmpScore = (tmpScore / 100.0)
                                let score = tmpScore.toFixed(2);
                                this.moves[this.currentMoveIndex].eval = score;
                                if(this.currentMoveIndex  == 0) {
                                    this.moves[this.currentMoveIndex].moveCat = MoveCategory.BOOK_MOVE.toString()
                                    return;
                                } else {
                                    let prevScore = this.moves[this.currentMoveIndex - 1].eval
                                    if(!prevScore) {
                                      return;
                                    }
                                    if(prevScore.startsWith("M") && tmpScore < 18) {
                                        this.moves[this.currentMoveIndex].moveCat = MoveCategory.BLUNDER.toString()
                                    } else {
                                        if(prevScore.startsWith("M")) {
                                            prevScore = 62+"";
                                        }
                                        if(!this.moves[this.currentMoveIndex].moveCat
                                            || (this.moves[this.currentMoveIndex].moveCat != "3"
                                            && this.moves[this.currentMoveIndex].moveCat != "BOOK_MOVE"
                                            && this.moves[this.currentMoveIndex].moveCat != "BEST"
                                            && this.moves[this.currentMoveIndex].moveCat != "2")) {

                                            let diff = tmpScore - Number.parseFloat(prevScore);
                                            //compute the turn
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
                                                    if(turn == 'w' && tmpScore > 3) {
                                                        this.moves[this.currentMoveIndex].moveCat = MoveCategory.MISTAKE.toString()
                                                    } else {
                                                        if(turn == 'b' && tmpScore < -3) {
                                                            this.moves[this.currentMoveIndex].moveCat = MoveCategory.MISTAKE.toString()
                                                        } else {
                                                            this.moves[this.currentMoveIndex].moveCat = MoveCategory.BLUNDER.toString()
                                                        }
                                                    }

                                                } else {
                                                  if(diff >= this.MISTAKE) {
                                                    this.moves[this.currentMoveIndex].moveCat = MoveCategory.MISTAKE.toString()
                                                  } else {
                                                    if(diff >= this.DUBIOUS) {
                                                      this.moves[this.currentMoveIndex].moveCat = MoveCategory.DUBIOUS.toString()
                                                    } else {
                                                      if(diff < this.DUBIOUS) {
                                                        this.moves[this.currentMoveIndex].moveCat = MoveCategory.GOOD_MOVE.toString()
                                                      }
                                                    }
                                                  }
                                                }
                                              } else {
                                                //it's not a bad move
                                                if(diff > this.BRILLIANT) {

                                                  this.moves[this.currentMoveIndex].moveCat = MoveCategory.BRILLIANT.toString()
                                                } else {

                                                  this.moves[this.currentMoveIndex].moveCat = MoveCategory.BEST.toString()
                                                }
                                              }
                                        }
                                    }
                                }
                            } else if(match[2] == 'mate') {
                                //does player went into mate by blunder?
                                let lastScore = this.moves[this.currentMoveIndex -1].eval
                                if(lastScore && lastScore.indexOf("M") < 0) {
                                    let turn = this.chess.turn();
                                    turn = turn == 'w' ? 'b' : 'w'
                                    let badMove = turn == 'w' ? (tmpScore < 0 ? true : false) : (tmpScore > 0 ? true : false)
                                    if(tmpScore > 0)
                                    this.moves[this.currentMoveIndex].eval = '+M' + tmpScore;
                                    else
                                    this.moves[this.currentMoveIndex ].eval = '-M' + Math.abs(tmpScore);
                                    if(badMove) {
                                        this.moves[this.currentMoveIndex].moveCat = MoveCategory.BLUNDER.toString()
                                    } else {
                                        if(!this.moves[this.currentMoveIndex].moveCat) {
                                            this.moves[this.currentMoveIndex].moveCat = MoveCategory.GOOD_MOVE.toString()
                                        }
                                    }
                                } else {
                                    if(!this.moves[this.currentMoveIndex].moveCat) {
                                        this.moves[this.currentMoveIndex].moveCat = MoveCategory.GOOD_MOVE.toString()
                                    }
                                }
                            }
                            let pv : string = match[4];
                            if(pv && pv.trim().length > 0) {
                              let candidateLines : PrimaryLines = new PrimaryLines();
                              candidateLines.setDepth(match[1])
                              let lans = pv.split(" ");
                              let lanToSanChess = new this.Chess(this.currentFen);
                              let pvMoves = []
                              lans.forEach(lan=> {
                                let moveMatch = lan.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
                                if(moveMatch) {
                                  let sanMove = lanToSanChess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
                                  if(sanMove)
                                    pvMoves.push(sanMove.san)
                                }
                              })
                              if(pvMoves.length > 0) {

                                if(match[2] == 'cp') {
                                  let pvEval = tmpScore.toFixed(2)
                                  candidateLines.pushLine(new PrimaryLine(pvEval, pvMoves));
                                } else if(match[2] == 'mate') {
                                  if(tmpScore > 0)
                                    candidateLines.pushLine(new PrimaryLine('+M' + tmpScore, pvMoves));
                                  else
                                    candidateLines.pushLine(new PrimaryLine('-M' + Math.abs(tmpScore), pvMoves));
                                }
                              }

                              this.moves[this.currentMoveIndex].candidateLines = candidateLines;
                            }
                        }
                    }
                  }
            }
            let cores = navigator.hardwareConcurrency
            if(cores > 1) {
              cores = cores/2
            }
            cores = Number.parseInt(cores+"");
            this.engineWorker.postMessage("uci")
            this.engineWorker.postMessage("setoption name Threads value " + cores ) //333619
        }
    }

    runGameAnalysis() {
        if(this.currentMoveIndex < 0) {
            this.currentMoveIndex++;
            this.chess.move(this.moves[0].move)
            this.currentFen = this.chess.fen();
            this.runStockFishForFen(this.currentFen);
        } else {
            this.currentMoveIndex++;
            if(this.currentMoveIndex < this.moves.length ) {
                if(this.moves[this.currentMoveIndex].move.indexOf("#") > -1) {
                    this.moves[this.currentMoveIndex].moveCat = MoveCategory.BEST.toString()
                    this.runGameAnalysis();
                } else {
                    this.chess.move(this.moves[this.currentMoveIndex].move)
                    this.currentFen = this.chess.fen();
                    this.runStockFishForFen(this.currentFen)
                }

            } else {
              this.engineWorker.terminate()
              if(this.caller)
                this.completionCallBack(this.moves, this.caller);
              else
                this.completionCallBack(this.moves);
            }

        }

    }

    runStockFishForFen(fen : string) {
        this.engineWorker.postMessage('stop');
        this.engineWorker.postMessage('position fen ' + fen);
        this.engineWorker.postMessage(`go depth ` + this.depth)
    }

    stopAnalysis() {
      this.engineWorker.postMessage('stop');
      this.engineWorker.terminate()
    }
}
