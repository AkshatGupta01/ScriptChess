import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Move } from 'src/app/models/move';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { generateRandomID } from 'src/app/util/strings';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
import { getHalfMoveNumberFromFen } from 'src/app/util/fen-validator';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit, OnDestroy {

  movePairs : any[] = []
  showBlackCommentIndex = 0;
  showWhiteCommentIndex = 0
  boardId : string | undefined;
  @Input()
  studyName : string

  @Input()
  author : string

  @Input()
  gamepgnstr : string | undefined;

  fen : string | undefined;


  moveIndex = 0;

  moveMode : boolean = true;
  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  moves : Move[] | undefined = [];
  processed : boolean = false;
  movesPLayed = 0;
  constructor(private analyticService  :AnalyticsService) {
    this.boardId = generateRandomID(5).trim();
  }

  ngOnDestroy(): void {
    this.analyticService.recordStudyLineInteraction(this.studyName, this.movesPLayed)
  }

  ngOnInit(): void {
    if(this.gamepgnstr) {
      let pgn = atob(this.gamepgnstr);
      pgn = pgn.split("\n").join("\r\n")
      this.chess.loadPgn(pgn,  {sloppy : true})
      let records = this.chess.header()
      if(records) {
        Object.keys(records).forEach(k=> {
          if(k.toLocaleLowerCase() == "fen") {
            this.fen = records[k]
          }
        })
      }
      let count = 1
      if(this.fen && this.fen != this.initialPosition) {
        count = getHalfMoveNumberFromFen(this.fen)
      }
      while(true) {
        let comment = this.chess.getComment();
        let currentMove = this.chess.undo();
        if(!currentMove)
          break;

        let move = {
          move : currentMove.san,
          moveNumber : 1,
          comment : comment
        }
        this.moves.push(move)
        this.fen = this.chess.fen();
      }
      for(let index = 1; index < count; index++) {
        this.moves.push(null)
      }
      this.moves.reverse();
      this.moveIndex = count;
      this.moves.forEach(m=> {
        if(m) {
          let moveNum = count/2 < 1 ? 1 : count%2 > 0 ? (count+ 1)/2 : count /2;
          m.moveNumber = moveNum ;
          count++;
        }

      })
      this.prepareGame();
      this.processed = true;
    }
  }

  prepareGame() {
    let movePair : any = {};
    for(let index = 1; index <= this.moves.length; index++) {
      if(!this.moves[index -1]) {
        continue
      }
      if(index % 2 != 0) {
        movePair = {}
        movePair["white"] = this.moves[index -1]
        if(index == this.moves.length) {
          this.movePairs.push(movePair)
        }
      } else {
        movePair["black"] = this.moves[index -1]
        this.movePairs.push(movePair)
      }
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

  makeMove(move : Move, isWhite : boolean, board : any, index : number) {
    this.movesPLayed++;
    let seqMoveIndex = isWhite ? (move.moveNumber * 2) - 1 : move.moveNumber * 2
    if(seqMoveIndex == (this.moveIndex + 1)) {
      //this is next move
      board.makeMove(move.move);
    } else {
      let moves : string[] = []
      for(let i = 0; i < seqMoveIndex; i++) {
        if(this.moves[i]) {
          moves.push(this.moves[i].move);
        }

      }
      board.makeMoves(moves);
    }

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

  }

  movePrev(board : ChessBoardComponent) {
    this.moveIndex--;
    board.undoMove();
  }

  moveNext(board : ChessBoardComponent) {
    let fen = board.getFen();
    let tmpChess = new this.Chess(fen);
    let isWhite = tmpChess.turn() == 'w';

    if(this.moves.length > this.moveIndex) {
      let move = this.moves[this.moveIndex];
      this.makeMove(move, isWhite, board, this.moveIndex);
    }
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
}
