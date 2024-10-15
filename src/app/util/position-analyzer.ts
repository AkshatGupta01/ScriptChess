import { environment } from "src/environments/environment";
import { StockfishEval } from "../models/eval";
import * as ChessJS from 'src/app/util/chessjs/chess';
import { getStockfishPath } from "./stockfish-util";
import { PrimaryLine, PrimaryLines } from "../models/move";
export class PositionAnalyzer {
    evalWorker: any;
    evalEngineRegistered: boolean;
    positionEval: string;
    scorePattern = /^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/
    bestMovePatter = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/
    Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
    defaultMode : boolean = true;
    moveSequenceCallBack : any;
    candidateLines = {}
    constructor(private fen, private depth, private completionCallback, private scoreCompletionCallback) {
        this.registerEvalStockFish();
    }



    runStockFishEvalForFen() {
        this.evalWorker.postMessage('position fen ' + this.fen);
        this.evalWorker.postMessage(`eval`)
    }

    runStockfishForScore() {
      if(this.depth > 0) {
        this.evalWorker.postMessage('position fen ' + this.fen);
        this.evalWorker.postMessage('go depth ' + this.depth);
      }
    }

    runNewStockFishEvalForFen(fen) {
      this.fen = fen;
      this.evalWorker.postMessage('position fen ' + fen);
      this.evalWorker.postMessage(`eval`)
    }

    close() {
      this.evalWorker.postMessage('quit');
    }

    runStockFishForScoreAndMoveSequence(fen, moveSequenceCallBack) {
      this.fen = fen;
      this.moveSequenceCallBack = moveSequenceCallBack
      this.evalWorker.postMessage('position fen ' + fen);
      this.evalWorker.postMessage('go depth ' + this.depth);
    }

    registerEvalStockFish() {
        if (typeof Worker !== 'undefined') {
          this.evalWorker = new Worker(new URL(getStockfishPath()));
          this.evalWorker.onmessage = ({ data }) => {
            if(data === "uciok") {
              this.evalEngineRegistered = true;
              this.runStockFishEvalForFen()
            } else {
              let match = data.match(this.scorePattern);
              if(!match) {

                match = data.match(this.bestMovePatter);
                if(match) {
                  this.moveSequenceCallBack(this.candidateLines)
                }
                else {
                  var line;

                  if (data && typeof data === "object") {
                      line = data.data;
                  } else {
                      line = data;
                  }

                  /// Ignore some output.
                  if (line === "uciok" || line === "readyok" || line.substr(0, 11) === "option name") {
                      return;
                  }
                  if(this.positionEval) {
                    this.positionEval += "\n";
                  }
                  this.positionEval += line;
                  if(line.startsWith("|") && line.split("|")[1].trim() == "Total") {
                    let stockFishEval = new StockfishEval(this.positionEval);
                    if(this.completionCallback)
                      this.completionCallback(stockFishEval)
                    if(!this.moveSequenceCallBack)
                      this.runStockfishForScore()
                  }
                }

              } else {
                let score = "0";
                  if(this.scoreCompletionCallback) {
                    let chess = new this.Chess(this.fen)
                    var tmpScore = parseInt(match[3]) * (chess.turn() == 'w' ? 1 : -1);
                    tmpScore = (tmpScore / 100.0)
                    score = tmpScore.toFixed(2);
                    this.scoreCompletionCallback(score)
                  }

                  if(this.moveSequenceCallBack) {
                    let pv : string = match[4];
                    let candidateLines;
                    if(pv && pv.trim().length > 0 && this.depth  ==  match[1]) {
                      candidateLines = new PrimaryLines();
                      candidateLines.setDepth(match[1])
                      let lans = pv.split(" ");

                      let lanToSanChess = new this.Chess(this.fen);
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
                          candidateLines.pushLine(new PrimaryLine(score, pvMoves, match[1]));
                        } else if(match[2] == 'mate') {
                          if(tmpScore > 0)
                            candidateLines.pushLine(new PrimaryLine('+M' + tmpScore, pvMoves, match[1]));
                          else
                            candidateLines.pushLine(new PrimaryLine('-M' + Math.abs(tmpScore), pvMoves, match[1]));
                        }
                      }
                    }
                    this.candidateLines = {
                      line : candidateLines,
                      score : score
                    }

                  }

              }

            }
          }
          this.evalWorker.postMessage('uci');
        }
    }
}
