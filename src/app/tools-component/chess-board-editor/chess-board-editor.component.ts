import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { BoardConfig, DropOffBoardSetting } from 'src/app/models/board.config';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { MatSnackBar } from '@angular/material/snack-bar';
import { validateFenEx } from 'src/app/util/fen-validator';
import { DOCUMENT } from '@angular/common';
import { HtmlUtilities } from 'src/app/util/html-utilities';

declare var ChessBoard: any;
@Component({
  selector: 'app-chess-board-editor',
  templateUrl: './chess-board-editor.component.html',
  styleUrls: ['./chess-board-editor.component.scss']
})
export class ChessBoardEditorComponent implements OnInit {

  boardConfig : BoardConfig | undefined
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();

  @Input()
  boardId: string = "__chessboard__";

  @Input()
  boardWidth : string = "";

  @Input()
  boardHeight: string ="";
  flipped: boolean
  board : any;
  whiteToPlay : boolean = true;
  whiteShortCastle : boolean
  blackShortCastle : boolean
  whiteLongCastle : boolean
  blackLongCastle : boolean
  currentFen  :string;
  originalWidth = "500px";
  @Output()
  onPositionSetComplete = new EventEmitter<any>()
  pieceTheme : string = "alpha";
  @Output()
  onPositionChange = new EventEmitter<any>()



  constructor(private snackbar : MatSnackBar) {

  }

  ngOnInit(): void {
    let self = this;
    this.boardHeight = this.originalWidth;
    this.boardWidth = this.originalWidth;
    let pieceTheme = localStorage.getItem("pieceTheme");
    if (pieceTheme) {
      this.pieceTheme = pieceTheme;
    } else {
      this.pieceTheme = "alpha";
    }
    this.boardConfig = {
      position : 'start',
      draggable: true,
      dropOffBoard: DropOffBoardSetting[DropOffBoardSetting.trash],
      pieceTheme : "/assets/pieces/"+this.pieceTheme+"/{piece}.svg",
      sparePieces: true,
      onDrop :  function (source: any, target: any, piece : any)
                {
                  return self.onDrop(source, target, piece);
                }
    }

  }

  onDrop(source, target, piece) {
    setTimeout(()=> {
      this.currentFen = this.createFen();
    }, 300)
  }

  ngAfterViewInit() {
    let h = window.innerHeight
    let w = window.innerWidth;
    if(w > 500) {
      h = h - (h/5);
      if(this.originalWidth.indexOf("px") > -1) {
        let num = Number.parseInt(this.originalWidth.replace("px", ""));
        if(num > h) {
          this.boardWidth = h + "px";
        }
      } else {
        if(this.boardWidth === "") {
          this.boardWidth = h + "px";
        }
      }
    }
    if(this.boardWidth.indexOf("px") > -1) {
      let num = Number.parseInt(this.originalWidth.replace("px", ""));
      this.boardWidth = (num + 2 * (num /8)) + "px"
      this.boardHeight = this.boardWidth;
    }
    this.board = ChessBoard(this.boardId, this.boardConfig);
  }

  flipOrientation() {

  }

  clearAllPieces() {
    this.board.clear(false)
  }

  setupPositionCompleted() {
    let fen = this.createFen();
    let chess = new this.Chess();
    try {
      let loaded = this.chess.load(fen)
      let validation = null;
      if(!loaded) {
        validation = ChessJS.validateFen(fen);
        this.snackbar.open(validation.error, "error")
      } else {
        validation = validateFenEx(this.chess, fen);
        if(!validation.valid) {
          this.snackbar.open(validation.error, "error")
        } else {
          this.onPositionSetComplete.emit(fen)
        }
      }
    } catch(e) {
      this.snackbar.open("Invalid fen", "close")
    }
  }

  createFen() {
    let fen = this.board.fen();
    if(this.whiteToPlay) {
      fen = fen + " " + 'w'
    } else {
      fen = fen + " " + 'b'
    }

    let tmpFen =  fen + " - - 0 1"
    let chess = new this.Chess(tmpFen);
    if(chess) {
      let e1Piece = chess.get('e1');
      let a1Piece = chess.get('a1');
      let h1Piece = chess.get('h1');
      if(e1Piece.color != 'w' || e1Piece.type != 'k') {
        this.whiteLongCastle = false;
        this.whiteShortCastle = false;
      } else {
        if(a1Piece.color != 'w' || a1Piece.type != 'r') {
          this.whiteLongCastle = false
        }
        if(h1Piece.color != 'w' || h1Piece.type != 'r') {
          this.whiteShortCastle = false
        }
      }

      let e8Piece = chess.get('e8');
      let a8Piece = chess.get('a8');
      let h8Piece = chess.get('h8');

      if(e8Piece.color != 'b' || e8Piece.type != 'k') {
        this.blackLongCastle = false;
        this.blackShortCastle = false;
      } else {
        if(a8Piece.color != 'b' || a8Piece.type != 'r') {
          this.blackLongCastle = false
        }
        if(h8Piece.color != 'b' || h8Piece.type != 'r') {
          this.blackShortCastle = false
        }
      }
    }
    let castleString = "-"


    if(this.whiteShortCastle) {
      castleString = "K"
    }

    if(this.whiteLongCastle) {
      castleString = castleString+"Q"
    }

    if(this.blackShortCastle) {
      castleString = castleString+"k"
    }

    if(this.blackLongCastle) {
      castleString = castleString+"q"
    }

    if(castleString != '-') {
      castleString = castleString.replace("-","");
    }
    fen = fen + " " + castleString;
    fen = fen + " - 0 1"
    this.onPositionChange.emit(fen)
    return fen;
  }

  setPlayer(color : string) {
    this.whiteToPlay = (color == 'white')
  }

  setCastle(color : string, side : string) {
    if(color == 'black') {
      if(side == 'short') {
        this.blackShortCastle = true;
      } else {
        this.blackLongCastle = true;
      }
    } else {
      if(side == 'short') {
        this.whiteShortCastle = true;
      } else {
        this.whiteLongCastle = true;
      }
    }
    this.currentFen = this.createFen()
  }
}
