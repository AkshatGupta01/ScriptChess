import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Move } from 'src/app/models/move';
import { Puzzle } from 'src/app/models/puzzle';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { AudioService } from 'src/app/services/audio.service';
import { generateRandomID } from 'src/app/util/strings';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { DOCUMENT } from '@angular/common';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { Store } from '@ngrx/store';
import { PuzzleCompleted } from 'src/app/rx/training/training.action';
@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})
export class PuzzleComponent implements OnInit {

  @Input()
  puzzle : Puzzle

  @Input()
  height: string = ""

  boardId : string
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  correctMoves : string[] = []
  playedMoves : Move[] = []

  currentFen : string;
  moveIndex = 0;
  inSync = true;
  allowPlay = false;
  showNext : boolean = false;
  @ViewChild(ChessBoardComponent) chessBoard: ChessBoardComponent;
  whiteOrientated : boolean = false;
  @Output()
  onComplete = new EventEmitter<any>()

  @Output()
  onCompleteWithAttempt = new EventEmitter<any>()
  mobileWidth = "320px"
  mobileMargin = 10;
  solved = false;
  attempt = 0;
  constructor(private audioService : AudioService, private router : Router,
              private analyticService : AnalyticsService,
              @Inject(DOCUMENT) private _document: Document, private store : Store) {
    this.boardId = generateRandomID(5).trim()

  }

  ngOnInit(): void {
    this.mobileWidth = (this._document.defaultView.innerWidth - 2 * this.mobileMargin)+"px";
  }
  startPuzzle() {
    this.correctMoves = []
    this.moveIndex = 0;
    this.chess = new this.Chess(this.puzzle.fen);

    this.puzzle.moves.forEach(m=> {
      let moveMatch = m.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
      let sanMove = this.chess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
      this.correctMoves.push(sanMove.san);
    })
    this.chess = new this.Chess(this.puzzle.fen);
    this.currentFen = this.puzzle.fen;
    this.playedMoves = []
    setTimeout(() => {
      if(this.chessBoard) {
        this.whiteOrientated = this.chess.turn() == 'w' ? false : true
        //this.chessBoard.whiteOrientated = true;
        if(this.chessBoard) {
          if((!this.whiteOrientated && this.chessBoard.getOrientation() == "white") || (this.whiteOrientated && this.chessBoard.getOrientation() == "black")) {
            this.chessBoard.flipOrientation()
          }
        }
        let m = this.correctMoves[0];
        this.chessBoard.makeMove(m)
        this.moveIndex++;
        this.chess.move(m)
        let playedMove : Move = {
          move : m,
          moveNumber : 1,
          fen : this.chess.fen()
        }
        if(playedMove.move && playedMove.move.trim().length > 0)
          this.playedMoves.push(playedMove)
        this.allowPlay = true;
        this.currentFen = this.chess.fen()
      }
    }, 1500);
  }

  ngAfterViewInit() {
  }

  onMove(moveDetails) {
    if(!this.inSync) {
      this.currentFen = this.chess.fen()
      this.inSync = true;
    }
    let index = ++this.moveIndex;
    let playedMove : Move = {
      move : moveDetails.move.san,
      moveNumber : index
    }
    if(this.correctMoves[index-1] ==  moveDetails.move.san) {
      this.chess.move(moveDetails.move.san);
      //this.audioService.playCorrectMoveAudio()
      playedMove.fen = this.chess.fen();
      this.playedMoves.push(playedMove);
      this.currentFen = this.chess.fen();
      setTimeout(()=> {
        if(this.chessBoard && this.correctMoves.length > (index+1)) {
          let m = this.correctMoves[index++];
          this.chessBoard.makeMove(m)
          this.moveIndex++;
          this.chess.move(m)
          let playedMove : Move = {
            move : m,
            moveNumber : index,
            fen : this.chess.fen()
          }
          this.playedMoves.push(playedMove)
          this.currentFen = this.chess.fen();
        } else {
          this.analyticService.recordPuzzleSolved(this.puzzle.rating)
          this.audioService.playCorrectMoveAudio()
          this.onNext()
        }
      }, 300)
    } else {
      this.audioService.playWrongMoveAudio()
      this.chessBoard.loadFen(this.currentFen)
      this.moveIndex--;
      this.attempt++;
      this.analyticService.recordPuzzleFailed(this.puzzle.rating)
    }

  }

  setPosition(move : Move) {
    this.currentFen = move.fen;
    this.inSync = this.chess.fen() == this.currentFen;
  }

  startEngine() {
    let base64Fen = btoa(this.currentFen)
    this.router.navigate([]).then(result => {  window.open("/tools/free-chess-engine?fen="+base64Fen); });
  }

  ngOnChanges() {
    if(this.puzzle) {
      this.startPuzzle()
      this.showNext = false;
    }
  }

  playSolution() {
    this.solved = false;
    setTimeout(()=> {
      if(this.correctMoves.length > this.moveIndex) {
        this.chess.move(this.correctMoves[this.moveIndex])
        this.chessBoard.makeMove(this.correctMoves[this.moveIndex])
        this.moveIndex++;
        let playedMove : Move = {
          move : this.correctMoves[this.moveIndex],
          moveNumber : this.moveIndex+1
        }
        playedMove.fen = this.chess.fen()
        if(playedMove.move && playedMove.move.trim().length > 0)
          this.playedMoves.push(playedMove)
        this.playSolution()

      } else {
        this.showNext = true;
      }
    }, 500)
  }

  onNext() {
    this.onComplete.emit();
    this.puzzle = {...this.puzzle}
    this.puzzle.solved = this.solved;
    this.puzzle.attempt = this.attempt;
    this.onCompleteWithAttempt.emit(this.puzzle)
  }

}
