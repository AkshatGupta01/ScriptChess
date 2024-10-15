import { Component, Inject, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/game';
import { Move } from 'src/app/models/move';
import {Clipboard} from '@angular/cdk/clipboard';
import { generateRandomID } from 'src/app/util/strings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChessBoardComponent } from '../chess-board/chess-board.component';
@Component({
  selector: 'app-game-summary-box',
  templateUrl: './game-summary-box.component.html',
  styleUrls: ['./game-summary-box.component.scss']
})
export class GameSummaryBoxComponent implements OnInit {

  @Input()
  game : Game | undefined;
  movePairs : any[] = []
  showBlackCommentIndex = 0;
  showWhiteCommentIndex = 0

  @Input()
  gameId : string | undefined;

  @Input()
  gamePgnStr : string | undefined;

  moveIndex = 0;

  moveMode : boolean = true;

  boardId : string | undefined
  currentFen : string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

  constructor(private clipboard: Clipboard, private snackbar : MatSnackBar) { 
    this.boardId = generateRandomID(5).trim();
  }

  ngOnInit(): void {
    

    if(this.game) {
      this.prepareGame(this.game)
    }
    
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

  copyPgn() {
    this.clipboard.copy(this.game.pgn)
    this.snackbar.open("PGN is copied to clipboard", "close", {
      duration: 3000
    })
  }

  copyFen() {
    this.clipboard.copy(this.currentFen)
    this.snackbar.open("Fen is copied to clipboard", "close", {
      duration: 3000
    })
  }



}
