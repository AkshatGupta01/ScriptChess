import { Move, MoveCategory } from "../models/move";
import * as ChessJS from 'src/app/util/chessjs/chess';
import { environment } from "src/environments/environment";
import { MovecatPipe } from "../pipes/movecat.pipe";
import { getStockfishPath } from "./stockfish-util";
import { ChangeDetectorRef } from "@angular/core";
export class StockfishPositionAnalyzer {
    Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
    chess = new this.Chess();
    engineWorker : any
    engineRegistered: boolean;
    bestMovePatter = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/
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
    turn ='w'
    currentScore = "0";
    constructor(private progressCallback, private depth, private cd : ChangeDetectorRef, private completionCallback, private caller) {
        this.registerStockFish();
    }

    registerStockFish() {
        if (typeof Worker !== 'undefined') {
            this.engineWorker = new Worker(new URL(getStockfishPath()));
            this.engineWorker.onmessage = ({ data }) => {
                if(data === "uciok") {
                    this.engineRegistered = true;
                } else {
                    let match = data.match(this.scorePattern);
                    if(match) {
                        //calculate and assign score
                        let chessForEngine = new this.Chess(this.currentFen);
                        var tmpScore = parseInt(match[3]) * (chessForEngine.turn() == 'w' ? 1 : -1);
                        if(match[2] == 'cp') {
                            tmpScore = (tmpScore / 100.0)
                            let score = tmpScore.toFixed(2);
                            this.progressCallback(score)
                            this.currentScore = score;
                        } else if(match[2] == 'mate') {
                            let score = "";
                            if(tmpScore > 0) {
                                score = "+M" + Math.abs(tmpScore)
                            } else {
                                score = "-M" + Math.abs(tmpScore)
                            }
                            this.progressCallback(score)
                            this.currentScore = score;
                        }
                    } else {
                        if(data && (data+"").startsWith("bestmove")) {
                            this.cd.markForCheck();
                            this.completionCallback(this.currentScore, this.caller)
                        }
                    }
                }
            }

            this.engineWorker.postMessage("uci")
        }
    }

    runStockFishForFen(fen : string) {
        this.chess = new this.Chess(fen);
        this.turn = this.chess.turn();
        this.currentFen = fen;
        this.engineWorker.postMessage('stop');
        this.engineWorker.postMessage('position fen ' + fen);
        this.engineWorker.postMessage(`go depth ` + this.depth)
    }
}
