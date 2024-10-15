import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Move, MoveCategory } from 'src/app/models/move';
import { Puzzle } from 'src/app/models/puzzle';
import { generateRandomID } from 'src/app/util/strings';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { ChessColors } from 'src/app/models/board.config';
import { MatMenuTrigger } from '@angular/material/menu';
import { MoveCollection } from 'src/app/models/move-collection';
import { PositionAnalyzer } from 'src/app/util/position-analyzer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-position-solver',
  templateUrl: './position-solver.component.html',
  styleUrls: ['./position-solver.component.scss']
})
export class PositionSolverComponent implements OnInit {

  @Input()
  puzzle : Puzzle

  @Input()
  height : string;

  boardId : string

  currentFen : string

  allowPlay = true;

  currentDialog : string
  dialoges = {
    "begin" : "Please Start making moves with white Pieces and also play the best response from Black. Let’s see if you are able to find the best continuation, Press the check button once you are done",
    "wrongMoveResponse" : "Well! I think there is beter response from your opponent, after %1",
    "wrongContinuationResponse" : "I think there's a better move than %1, Let's try again",
    "rightContinuation":" You Solved it buddy!, good job. Let move on to next",
    "thinking" : "Hmm, let see!! ....",
    "betterVariationBut" : "You found a good varitaion after %1, but I think %2 would be better after %3. Anyway, the opponent played %4. So let's Continue here",
    "betterVariation" : "You found a good varitaion after %1, But the opponent played %2. So let's Continue here",
    "wrongMove": "There's a better move than %1 as opponent can play %2. It's not that good",
    "beginBlindFold": "Observe and Imagine the given position Carefully and Write in the solution in Standard Notation into given text box. Write one variations in one line, don't use move number, each move must be separated by space",
    "notSameBegining" : "The first move of all variations must be same",
    "invalidMove" : "%1 is invalid move. It could be an ambiguous move as well eg: Rh6 would incorrect, if more than one rook can be played to h6 square"
  }

  playedMoves : Move[] = []
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  index = 0;
  showNext = false;
  showReset = false;

  @ViewChild('board')
  board : ChessBoardComponent;
  correctMoves : string[] = []
  //for context menu
  menuTopLeftPosition =  {x: '0', y: '0'}
  // reference to the MatMenuTrigger in the DOM
  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

  moveCollection : MoveCollection
  selectedMove: Move;
  isSideMoveOn: boolean;
  playerColor : ChessColors

  blindFold : boolean = false;
  blindFoldPosition : any = null;
  rows = [1,2,3,4,5,6,7,8]
  columns = ['a','b','c','d','e','f','g','h']
  playDaialogFormat = "It's %1 to move"
  playDaialog = "";
  blindFoldMovesStr = ""
  solved = false;
  attempt = 0

  @Output()
  onComplete = new EventEmitter<any>()

  @Output()
  onCompleteWithAttempt = new EventEmitter<any>()

  @Output()
  onToggleBlindfold =  new EventEmitter<any>()

  constructor(private router : Router){
    this.boardId = generateRandomID(5).trim()
    this.currentDialog = this.dialoges["begin"]
  }

  ngOnInit(): void {
    this.correctMoves = []
    this.currentFen = this.puzzle.fen
    this.chess = new this.Chess(this.currentFen)
    let tmpchess = new this.Chess(this.currentFen)
    this.playerColor = this.chess.turn() == 'w' ? ChessColors.black : ChessColors.white
    this.puzzle.moves.forEach(m=> {
      let moveMatch = m.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
      let sanMove = tmpchess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
      this.correctMoves.push(sanMove.san);
    })
  }

  prepareBlindFold() {
    // for(let i = 0; i < this.rows.length; i++) {
    //   for(let j = 0; j < this.columns.length; j++) {
    //     let square = this.columns[j] + this.rows[i];
    //     this.chess.board
    //   }
    // }
    let tmpchess = new this.Chess(this.puzzle.fen)
    let m = tmpchess.move(this.correctMoves[0])
    let boardArray = tmpchess.board()
    this.blindFoldPosition = {}
    boardArray.forEach(row=> {
      row.forEach(cell=> {
        if(cell) {
          if(!this.blindFoldPosition[cell.color]) {
            this.blindFoldPosition[cell.color] = {}
          }
          if(!this.blindFoldPosition[cell.color].pieces) {
            this.blindFoldPosition[cell.color].pieces=  []
          }
          //let piece = cell.color == "b" ? cell.type : cell.type.toUpperCase()
          this.blindFoldPosition[cell.color].pieces.push({
            piece : cell.type.toUpperCase(),
            square : cell.square
          })
        }
      })
    })
    this.blindFoldPosition["b"]["pieces"].sort((a, b) => (a.piece > b.piece) ? 1 : -1)
    this.blindFoldPosition["w"]["pieces"].sort((a, b) => (a.piece > b.piece) ? 1 : -1)
    this.playDaialog = this.playDaialogFormat.replace("%1", tmpchess.turn() == 'b' ? "Black" : "White")
  }

  ngAfterViewInit(): void {
    this.setPuzzle()
  }

  ngOnChanges() {
    if(this.puzzle) {
      this.reset()
      //this.setPuzzle()
      this.showNext = false;
    }
  }

  reset() {
    this.correctMoves = []
    this.currentFen = this.puzzle.fen
    this.chess = new this.Chess(this.currentFen)
    let tmpchess = new this.Chess(this.currentFen)
    this.showNext = false;
    this.playedMoves = []
    this.puzzle.moves.forEach(m=> {
      let moveMatch = m.match(/^([a-h][1-8])([a-h][1-8])([qrbn])?/)
      let sanMove = tmpchess.move({from: moveMatch[1], to: moveMatch[2], promotion: moveMatch[3]});
      this.correctMoves.push(sanMove.san);
    })
    if(this.board)
      this.board.loadFen(this.currentFen)
    this.setPuzzle();
  }

  setPuzzle() {
    if(this.puzzle) {
      this.chess = new this.Chess(this.currentFen)
      this.currentDialog = this.dialoges["begin"]
      this.moveCollection = new MoveCollection();
      this.index = 1;
      this.playedMoves = []
      this.showReset = false;
      this.showNext = false;
      let playedBy = this.chess.turn() == 'w' ? ChessColors.white :  ChessColors.black
      if(this.board) {
        if(this.playedMoves.length > 0)
          this.board.loadFen(this.currentFen)


        setTimeout(()=>{

          if(this.chess.turn() == 'w' && this.board.getOrientation() == 'white') {
            this.board.flipOrientation()
          }
          this.board.makeMove(this.correctMoves[0])

        }, 1500)


      }
      let m = this.chess.move(this.correctMoves[0])
      console.log(this.chess.fen())
      let fen = this.chess.fen()
      this.currentFen = fen;
      let playedMove : Move = {
        move : m.san,
        moveNumber : this.index,
        fen : fen,
        playedBy : playedBy
      }
      this.moveCollection.addMove(playedMove);
      this.playedMoves = this.moveCollection.getMoveArray();
      setTimeout(()=> this.prepareBlindFold(), 500)
    }
  }

  onMove(moveDetails) {
    if(this.chess.turn() == "w") {
      this.index++
    }

    if(!this.showReset) {
      this.showReset = true
    }

    let playedMove : Move = {
      move : moveDetails.move.san,
      moveNumber : this.index,
      fen : moveDetails.fen,
      playedBy : this.chess.turn() == 'w' ? ChessColors.white :  ChessColors.black
    }
    let m = this.chess.move(playedMove.move)
    if(m) {
      this.moveCollection.addMove(playedMove)
      this.playedMoves = this.moveCollection.getMoveArray()
    }
  }

  prepareBlindFoldMoves() {
    let tmpChess = null
    if(this.blindFoldMovesStr && this.blindFoldMovesStr.trim().length > 0 ) {
      let blindFoldMovesStrArr = this.blindFoldMovesStr.split("\n");
      for(let i = 0; i < blindFoldMovesStrArr.length; i++ ) {
        this.index = 1
        tmpChess = new this.Chess(this.currentFen)
        tmpChess.move(this.correctMoves[0])
        let variationArr = blindFoldMovesStrArr[i].split(" ")
        let turn = tmpChess.turn() == 'w' ? ChessColors.white :  ChessColors.black;
        let move = null;
        for(let j = 0; j < variationArr.length; j++) {
          turn = tmpChess.turn() == 'w' ? ChessColors.white :  ChessColors.black;
          move = tmpChess.move(variationArr[j])
          if(move) {
            if(turn == ChessColors.white) {
              this.index++;
            }
            if(this.playedMoves[j+1] &&  this.playedMoves[j+1].move == variationArr[j] && this.playedMoves[j+1].playedBy == turn
              && this.playedMoves[j+1].moveNumber == this.index) {
                this.moveCollection.setLastPlayedMove(this.playedMoves[j+1])
                continue;
            }
            let playedMove : Move = {
              move : variationArr[j],
              moveNumber : this.index,
              fen : tmpChess.fen(),
              playedBy : turn
            }
            this.moveCollection.addMove(playedMove)
            this.playedMoves = this.moveCollection.getMoveArray()
          } else {
            let moveNum = this.index + (turn == ChessColors.white? "." : ".." )
            this.currentDialog = this.dialoges["invalidMove"].replace("%1", moveNum +" " + variationArr[j])
            break;
          }
        }
      }
    }
    if(tmpChess) {
      this.chess = tmpChess;
    }
  }

  solutionWritten($event) {
    this.showReset = this.blindFoldMovesStr && this.blindFoldMovesStr.trim().length > 0
  }

  startEngine() {
    let base64Fen = btoa(this.currentFen)
    this.router.navigate([]).then(result => {  window.open("/tools/free-chess-engine?fen="+base64Fen); });
  }

  playSolution() {
    this.index = 1;
    this.playedMoves = []
    let tmpChess = new this.Chess(this.puzzle.fen)
    this.playSolutionInt(0, tmpChess)
  }

  playSolutionInt(i, chess) {
    this.solved = false;
    let turn = chess.turn() == 'w' ? ChessColors.white : ChessColors.black;
    setTimeout(()=> {
      if(this.correctMoves.length > i) {
        chess.move(this.correctMoves[i])
        if(this.board)
          this.board.makeMove(this.correctMoves[i])

        let playedMove : Move = {
          move : this.correctMoves[i],
          moveNumber : this.index,
          playedBy : turn
        }
        if(chess.turn() == 'w') {
          this.index++
        }
        playedMove.fen = chess.fen()
        if(playedMove.move && playedMove.move.trim().length > 0)
          this.playedMoves.push(playedMove)
        i++;
        this.playSolutionInt(i, chess)

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

  checkContinuation() {
    if(this.blindFold) {
      this.prepareBlindFoldMoves()
    }
    this.solved = false;
    this.attempt++;
    let wrongMove = false;
    for(let index = 0; index < this.correctMoves.length && !this.solved; index++) {
      if(this.playedMoves[index].move == this.correctMoves[index]) {
        this.playedMoves[index].moveCat = MoveCategory.BEST.toString()
        continue
      } else {
        wrongMove = true;
        if(this.playedMoves[index].sideMovesArray && this.playedMoves[index].sideMovesArray.length > 0) {
          for(let j = 0; j < this.playedMoves[index].sideMovesArray.length; j++) {
            this.solved = this.checkContinuationInSideMove(this.playedMoves[index].sideMovesArray[j], index, j);
            this.playedMoves[index].sideMovesArray[j] = [... this.playedMoves[index].sideMovesArray[j]]
            if(this.solved) {
              break
            }
          }

        } else {
          this.playedMoves[index].moveCat = MoveCategory.BLUNDER.toString()
          this.solved = false;
          if(this.playedMoves[index].playedBy != this.playerColor) {
            this.currentDialog = this.dialoges["wrongContinuationResponse"].replace("%1", this.playedMoves[index].moveNumber +".." + this.playedMoves[index].move)
            this.checkCorrectContinuation(index)
          }

          break
        }
      }
    }
    //this.playedMoves = {... this.playedMoves}
    this.solved = !wrongMove || this.solved
    if(this.solved) {
      this.currentDialog = this.dialoges["rightContinuation"]
      this.showNext = true;
    }
  }

  checkCorrectContinuation(index: number, sideMoveIndex = -1) {
    let self = this;
    let tmpChess = new this.Chess(this.currentFen)
    for(let i = 0; i< index; i++) {
      tmpChess.move(this.playedMoves[i].move)
    }
    let mistakenFen = tmpChess.fen();
    if(sideMoveIndex  < 0 ) {
      let analyzer = new PositionAnalyzer(mistakenFen, 25, null, null);
      analyzer.runStockFishForScoreAndMoveSequence(mistakenFen, (seqScore)=> {
        analyzer.close()
        self.validateCalculationAndCreateDialog(this.playedMoves, index, seqScore)
      })
    } else {

    }

  }
  validateCalculationAndCreateDialog(playedMoves, index, seqScore) {
    let firstMoveMatches = playedMoves[index].move == seqScore.line.lines[0].moves[0];
    let playerMovePeriod = this.playerColor == ChessColors.white ? "." : ".."
    let opponentMovePeriod = this.playerColor == ChessColors.white ? ".." : "."
    if(firstMoveMatches) {
      let min = Math.min(playedMoves.length, seqScore.line.lines[0].moves.length)
      let missMatchIndex = -1;
      for(let i = 0; i< min; i++) {
        if(playedMoves[index + i].move != seqScore.line.lines[0].moves[i]) {
          missMatchIndex = i;
          break;
        }
      }


      if(missMatchIndex > -1) {
        this.currentDialog = this.dialoges["betterVariationBut"].replace("%1", playedMoves[index -1].moveNumber + playerMovePeriod
                                                                          + " "  +playedMoves[index -1].move)
                                                                .replace("%2", seqScore.line.lines[0].moves[missMatchIndex])
                                                                .replace("%3", seqScore.line.lines[0].moves[missMatchIndex -1])
                                                                .replace("%4", playedMoves[index -1].moveNumber +
                                                                opponentMovePeriod + " " + this.correctMoves[index])
      } else {
        this.currentDialog = this.dialoges["betterVariationBut"].replace("%1", playedMoves[index -1].move)
                                                                .replace("%2", opponentMovePeriod + " " + playedMoves[index])
      }

      let move = {
        moveNumber : playedMoves[index -1].moveNumber,
        move : this.correctMoves[index],
        playedBy : this.playerColor == ChessColors.white ? ChessColors.black : ChessColors.white
      }
      this.index = playedMoves[index -1].moveNumber
      this.chess = new this.Chess(playedMoves[index -1].fen)
      this.chess.move(this.correctMoves[index])
      this.board.loadFen(this.chess.fen())
      this.moveCollection.setLastPlayedMove(playedMoves[index -1])
      this.moveCollection.addMove(move)
      this.playedMoves = this.moveCollection.getMoveArray()

    } else {
      if(this.playerColor == playedMoves[index].playedBy)  {
        let moveSeq = ""
        seqScore.line.lines[0].moves.forEach(m=> {
          moveSeq = moveSeq + ", " + m
        })

        moveSeq = moveSeq.substring(2)
        this.currentDialog = this.dialoges["wrongMove"].replace("%1", playedMoves[index].moveNumber + playerMovePeriod +" " +
        playedMoves[index].move).replace("%2", moveSeq)
      }

    }
  }

  validateCalculationAndCreateDialogex(index, seqScore, sideMoveArrayIndex = -1, sideMoveIndex = -1, self) {
    let firstMoveMatches = false;
    if(sideMoveArrayIndex < 0) {
      firstMoveMatches = self.playedMoves[index].move == seqScore.line.lines[0].moves[0];
    } else {
      if(sideMoveArrayIndex > -1 && sideMoveIndex > -1) {
        firstMoveMatches = self.playedMoves[index].sideMovesArray[sideMoveArrayIndex][sideMoveIndex].move = seqScore.line.lines[0].moves[0];
      }
    }
    if(firstMoveMatches) {
      let min = Math.min(self.playedMoves.length, seqScore.line.lines[0].moves.length)
      let missMatchIndex = -1;
      for(let i = 0; i< min; i++) {
        if(self.playedMoves[index + i].move != seqScore.line.lines[0].moves[i]) {
          missMatchIndex = i;
          break;
        }
      }
      let playerMovePeriod = self.playerColor == ChessColors.white ? "." : ".."
      let opponentMovePeriod = self.playerColor == ChessColors.white ? ".." : "."
      if(missMatchIndex > -1) {
        self.currentDialog = self.dialoges["betterVariationBut"].replace("%1", self.playedMoves[index -1].moveNumber + playerMovePeriod
                                                                          + " "  +self.playedMoves[index -1].move)
                                                                .replace("%2", seqScore.line.lines[0].moves[missMatchIndex])
                                                                .replace("%3", seqScore.line.lines[0].moves[missMatchIndex -1])
                                                                .replace("%4", self.playedMoves[index -1].moveNumber +
                                                                opponentMovePeriod + " " + self.correctMoves[index])
      } else {
        self.currentDialog = self.dialoges["betterVariationBut"].replace("%1", self.playedMoves[index -1].move)
                                                                .replace("%2", opponentMovePeriod + " " + self.correctMoves[index])
      }
      let move = {
        moveNumber : self.playedMoves[index -1].moveNumber,
        move : self.correctMoves[index],
        playedBy : self.playerColor == ChessColors.white ? ChessColors.black : ChessColors.white
      }
      self.index = self.playedMoves[index -1].moveNumber
      self.chess = new self.Chess(self.playedMoves[index -1].fen)
      self.chess.move(self.correctMoves[index])
      self.board.loadFen(self.chess.fen())
      self.moveCollection.setLastPlayedMove(self.playedMoves[index -1])
      self.moveCollection.addMove(move)

    }
  }

  checkContinuationInSideMove(sideMoves: Move[], index: number, sideMoveArrayIndex) {
    let solved = true;
    for(let i = 0; i < this.correctMoves.length - index; i++) {
      if(sideMoves[i].move == this.correctMoves[index + i]) {
        sideMoves[i].moveCat = MoveCategory.BEST.toString()
        continue
      } else {
        if(sideMoves[i].sideMovesArray &&  sideMoves[i].sideMovesArray.length > 0) {
          for(let j = 0; j < sideMoves[i].sideMovesArray.length; j++) {
            solved = this.checkContinuationInSideMove(sideMoves[i].sideMovesArray[j], index, j);
            if(solved) {
              sideMoves = [...sideMoves]
              break
            }
          }
          if(solved) {
            sideMoves = {...sideMoves}
            break
          }
        } else {
          sideMoves[i].moveCat = MoveCategory.BLUNDER.toString()
          solved = false
          sideMoves = [...sideMoves]
          let self = this;
          let analyzer = new PositionAnalyzer(sideMoves[i].fen, 25, null, null);
          analyzer.runStockFishForScoreAndMoveSequence(sideMoves[i].fen, (seqScore)=> {
            analyzer.close()
            self.validateCalculationAndCreateDialog(sideMoves, i, seqScore)
          })
          break
        }
      }
    }
    return solved;
  }

  findBestContinuation(fen, lastMove) {

  }

  setPosition(move : Move)  {
    this.chess = new this.Chess(this.puzzle.fen)
    this.board.setInitialPosition(this.puzzle.fen)
    let playedMove = null;
    let alreadyPlayedMoves = [];

    for(let index = 0; index < this.playedMoves.length; index++) {
      if(this.playedMoves[index].move == move.move &&
        this.playedMoves[index].moveNumber == move.moveNumber &&
        this.playedMoves[index].playedBy == move.playedBy) {
        playedMove = this.chess.move(this.playedMoves[index].move)
        alreadyPlayedMoves.push(playedMove.san);
        this.selectedMove = this.playedMoves[index]
        this.moveCollection.setLastPlayedMove(this.selectedMove)
        this.isSideMoveOn = this.playedMoves[index].isSideMove
        this.index = this.playedMoves[index].moveNumber;
        break
      } else {
        playedMove = this.chess.move(this.playedMoves[index].move)
        alreadyPlayedMoves.push(playedMove.san);
      }

    }
    this.currentFen = this.chess.fen();
    if(this.board) {
      this.board.makeMoves(alreadyPlayedMoves);
    }
  }

  onContextClick(event, item) {

  }

  deleteFrom(item) {

  }

  deleteAfter(item) {

  }

  onMoveClick(move) {

  }

  onSideMoveContextClick(move) {

  }

  toggleBlindFold() {
    this.blindFold = !this.blindFold
    if(this.blindFold) {
      this.currentDialog = this.dialoges["beginBlindFold"]
    } else {
      setTimeout(()=>{
        this.board.loadFen(this.chess.fen())
      }, 400)
    }

    this.onToggleBlindfold.emit(this.blindFold)

  }
}
