import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Move } from 'src/app/models/move';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generateRandomID } from 'src/app/util/strings';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';


declare function getCanvas(divId, copyDivId, callback) : any
declare function initializeGifCreation(canvas) : any
declare function addCanvas(canvas) : any
declare function finish() : any

@Component({
  selector: 'app-pgn-viewer',
  templateUrl: './pgn-viewer.component.html',
  styleUrls: ['./pgn-viewer.component.scss']
})
export class PgnViewerComponent implements OnInit {

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
  gameLoaded : false;
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  loadingGame = false;
  constructor(private service : ScriptChessServiceService, private snackBar : MatSnackBar, private analyticService : AnalyticsService) {
    this.boardId = generateRandomID(5).trim();
  }

  ngOnInit(): void {
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
    this.moveIndex--;
    board.undoMove();
  }

  moveNext(board : ChessBoardComponent) {
    let isWhite = this.moveIndex % 2 == 0 ? true : false;
    if(this.game.moves.length > this.moveIndex) {
      let move = this.game.moves[this.moveIndex];
      this.makeMove(move, isWhite, board);
    }
  }
  makeMove(move : Move, isWhite : boolean, board : any) {
    let seqMoveIndex = isWhite ? (move.moveNumber * 2) - 1 : move.moveNumber * 2
    if(seqMoveIndex == (this.moveIndex + 1)) {
      //this is next move
      board.makeMove(move.move);
    } else {
      let moves : string[] = []
      for(let i = 0; i < seqMoveIndex; i++) {
        moves.push(this.game.moves[i].move);
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
    this.currentFen = board.getFen();
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

  onPgnEnter(pgn : string) {
    this.loadingGame = true;
    if(this.chess.loadPgn(pgn)) {
      this.service.parsePgn(pgn).subscribe(response=> {
        if(response && response.body && response.body.length > 0) {
          this.game = response.body[0];
          this.prepareGame(this.game)
          this.loadingGame = false;
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

  createAnimation(board) {
    // let animationStarted = false;
    // board.resetBoard();
    // this.chess.reset();
    // this.moveIndex = 0;
    // let totalMoveCount = 0;
    // this.movePairs.forEach(mp => {
    //   if(mp.black) {
    //     totalMoveCount+=2;
    //   } else {
    //     totalMoveCount+=1;
    //   }
    // })
    // getCanvas(this.boardId, null, (canvas)=> {
    //   initializeGifCreation(canvas);

    //   this.movePairs.forEach(mp=> {
    //     getCanvas(this.boardId, "copy-div", (canvas)=> {
    //       if(this.moveIndex == totalMoveCount) {
    //         finish();
    //       } else {
    //         addCanvas(canvas);
    //         this.moveNext(board);
    //       }
    //     })
    //   })
    // })


  }

}
