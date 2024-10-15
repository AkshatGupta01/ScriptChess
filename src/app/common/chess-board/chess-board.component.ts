import { DOCUMENT } from '@angular/common';
import { ConstantPool } from '@angular/compiler';
import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2, SimpleChange, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { BoardConfig, ChessColors, DropOffBoardSetting, Speed } from 'src/app/models/board.config';
import { AudioService } from 'src/app/services/audio.service';
import { HtmlUtilities } from 'src/app/util/html-utilities';
import { generateRandomID } from 'src/app/util/strings';
import { PromotionDialog } from './promotion-dialoge';
import { HostListener } from "@angular/core";
import { getCoverageMatrix } from 'src/app/util/chessjsutil';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

declare var ChessBoard: any;
declare function removeGreySquares(id): any;
declare function greySquare(square, id): any;
declare function highlightMoves(move, id): any;
declare function removeHighlights(id): any;
declare function stopScroll(): any;
declare function resumeScroll(): any;
declare function $(selector): any
declare function loadArrowSupport(id): any
declare function removeAllSquareConnectingArrow(id): any
declare function selectSquare(id, square): any
declare function removeSelectSquare(id, square): any
declare function PrintDiv(div, name) : any
declare function colorDominance(dominance, id) : any
declare function removeDominance(id) : any
declare function drawNetwork(matrix, position, id, onlyAttacks)
declare function removeNetwork(id)
declare function setOrientation(black, id)
export interface DialogData {
  turn: string
}

@Component({
  selector: 'app-chess-board',
  templateUrl: './chess-board.component.html',
  styleUrls: ['./chess-board.component.scss']
})
export class ChessBoardComponent implements OnInit {
  boardConfig: BoardConfig | undefined
  board: any;
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();

  @Input()
  allowPlay: boolean = false;

  @Input()
  white: string | undefined;

  @Input()
  whiteElo: number | undefined

  @Input()
  blackElo: number | undefined

  @Input()
  black: string | undefined;

  @Input()
  score: string;

  @Input()
  fen: string | undefined;

  startingFen: string | undefined;

  @Input()
  boardId: string = "__chessboard__";

  @Output()
  onMove = new EventEmitter<any>()

  @Output()
  onMoveEx = new EventEmitter<any>()

  @Input()
  allowAnnotations = false;

  @Input()
  showScore;

  @Input()
  boardWidth: string = "";

  movesPlayed: string[] = [];
  noAudio = false;

  @Input()
  showAudioControl = true;

  @Input()
  autoQueenPromotion = false;

  @Input()
  studyMode: boolean = false;

  @Input()
  boardHeight: string = "";
  htmlUtility: HtmlUtilities = new HtmlUtilities()

  @Input()
  engineThinking = false;

  @Input()
  whiteOrientated = true;

  @Input()
  allowSetPosition: boolean = false;

  @Input()
  empty: boolean = false;




  @Input()
  mini : boolean = false;

  @Input()
  onlyAttacks = false;

  @Input()
  fitWidth = false;

  scoreForBar = 0;
  orientation = ChessColors.white

  annotationOverlay: any;

  fabClass = "disable-fab"
  annotationEnabled = "";
  adjustProgress = "col-12";
  showProgress = "col-0";
  flipped = false;
  pieceTheme: string
  choosenPiece: string
  turn: string
  menuTopLeftPosition = { x: '0', y: '0' }
  pieceThemes: string[] = ["alpha", "california", "cburnett", "chess7", "chessnut", "chicago", "companion",
    "dark-sc", "fantasy", "iowa", "kosal", "leipzig", "letter", "merida", "mono", "oslo", "pirouetti",
    "pixel", "reilly", "riohacha", "scriptchess", "shapes", "spatial", "symmetric","test"]
  blackImbalance: string = ""
  whiteImbalance: string = ""

  wImbObj = {}
  bImbObj = {}
  prevFen = "";
  imbFen = "";
  selectedSquare = null;
  originalWidth  = this.boardWidth;
  showEval = true;

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger;

  scrHeight:any;
  scrWidth:any;
  dominationPainted = false;
  webPainted = false;
  @HostListener('window:resize', ['$event'])

  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  firstSquare : string = null;
  @Input()
  noMenu = false
  getScreenSize(event?) {
    let h = window.innerHeight
    let w = window.innerWidth;
    // if(w > 500) {
    //   h = h - (90 + 175);
    //   if(this.originalWidth.indexOf("px") > -1) {
    //     let num = Number.parseInt(this.originalWidth.replace("px", ""));
    //     if(num > h) {
    //       this.boardWidth = h + "px";
    //     }
    //   } else {
    //     if(this.boardWidth === "") {
    //       this.boardWidth = h + "px";
    //     }
    //   }
    //   if(this.board) {
    //     this.board.resize();
    //   }
    // }

  }

  constructor(private audioService: AudioService, private renderer2: Renderer2, @Inject(DOCUMENT) private _document: any,
  public dialog: MatDialog, private snackbar : MatSnackBar, private router : Router) {
    let pieceTheme = localStorage.getItem("pieceTheme");
    if (pieceTheme) {
      this.pieceTheme = pieceTheme;
    } else {
      this.pieceTheme = "alpha";
    }
    this.turn = 'w'
  }

  ngOnInit(): void {
    if (!this.boardId || this.boardId.trim().length == 0) {
      this.boardId = generateRandomID(5).trim();
    }

    this.createBoardConfig()
    this.htmlUtility.addWrapperJsScript(this.renderer2, this._document, "/assets/js/chess-highlight.js")
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

  }

  createBoardConfig() {
    let self = this;
    if(this.empty) {
      this.boardConfig = {}
      return
    }
    this.boardConfig = {
      position: 'start',
      orientation: this.whiteOrientated ? "white" : "black",
      showNotation: true,
      dropOffBoard: DropOffBoardSetting.snapback,
      pieceTheme: "/assets/pieces/" + this.pieceTheme + "/{piece}.webp",
      moveSpeed: Speed.slow,
      draggable: this.allowPlay,
      snapbackSpeed: 500,
      snapSpeed: 100,
      sparePieces: false,
      enableDoubleTap : true,
      onDrop: function (source: any, target: any, piece: any) {
        return self.onDrop(source, target, piece);
      },
      onDragStart: function (source: any, target: any) {
        return self.onDragStart();
      },
      onSnapEnd: function () {
        self.board.position(self.chess.fen())
      },
      onMouseoutSquare: function (square, piece) {
        self.onMouseoutSquare(square, piece)
      },
      onMouseoverSquare: function (square, piece) {
        self.onMouseoverSquare(square, piece)
      },
      onChange: function (oldPos, newPos) {
      },
      onSecondTap : function(firstSquare, secondSquare) {
        self.onSecondTap(firstSquare, secondSquare);
      },
      onFirstTap : function(firstSquare) {
        self.onFirstTap(firstSquare);
      }
    }
    if (this.allowSetPosition) {
      this.boardConfig.sparePieces = true
      this.boardConfig.dropOffBoard = DropOffBoardSetting.trash
    }
  }

  onFirstTap(firstSquare) {
    selectSquare(this.boardId, firstSquare)
    if (!this.allowPlay)
      return
    // get list of possible moves for this square
    var moves: any = this.chess.moves({
      square: firstSquare,
      verbose: true
    })
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to, this.boardId)
    }
    this.firstSquare = firstSquare;
  }

  onSecondTap(firstSquare: any, secondSquare: any) {
    let piece = this.chess.get(firstSquare);5
    if(piece) {
      this.onDrop(firstSquare, secondSquare, piece.type)
    }
    removeSelectSquare(this.boardId, firstSquare)
    removeSelectSquare(this.boardId, secondSquare)
  }

  onDragStart() {
    stopScroll()
  }

  onMouseoverSquare(square, piece) {
    if (!this.allowPlay)
      return
    // get list of possible moves for this square
    var moves: any = this.chess.moves({
      square: square,
      verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square, this.boardId)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greySquare(moves[i].to, this.boardId)
    }
  }

  onMouseoutSquare(square, piece) {
    if (!this.allowPlay)
      return
    removeGreySquares(this.boardId)
  }

  ngAfterViewInit() {
    if (this.fen) {
      this.boardConfig.position = this.fen;
      this.chess = new this.Chess(this.fen);
      this.startingFen = this.fen;
    }
    if(this.chess) {
      this.turn = this.chess.turn();
    }
    var $container = $("#" + this.boardId)
    var loopCounter = 0
    setTimeout(() => {
      if (this.showScore) {
        this.showProgress = "col-1"
        this.adjustProgress = "col-11"
      } else {
        this.showProgress = "col-0"
        this.adjustProgress = "col-12"
      }
      setTimeout(() => {
        if (this.whiteOrientated) {
          this.orientation = ChessColors.white
        } else {
          this.orientation = ChessColors.black
        }
        this.boardConfig.orientation = this.orientation == 1 ? "white" : "black";
        this.board = ChessBoard(this.boardId, this.boardConfig);
        if (this.allowAnnotations) {
          this.annotationEnabled = "hideAnnotations"
        }
        loadArrowSupport(this.boardId)
        setOrientation(!this.whiteOrientated, this.boardId)

      }, 500)
    }, 1000)


  }
  createBoard() {
    this.createBoardConfig();
    this.boardConfig.position = this.fen;
    this.boardConfig.draggable = this.allowPlay;
    this.chess = new this.Chess(this.fen);
    setTimeout(() => {
      this.board = ChessBoard(this.boardId, this.boardConfig);
    }, 500)
    this.turn = this.chess.turn();
  }

  ngOnChanges(change : SimpleChange) {
    if (this.fen && this.boardConfig && (change["fen"] && change["fen"].currentValue != change["fen"].previousValue)) {
      this.createBoard()
    }
    if(change["allowPlay"] && (change["allowPlay"].currentValue != change["allowPlay"].previousValue)) {
      this.createBoard()
    }
    if (this.showScore) {
      this.showProgress = "col-1"
      this.adjustProgress = "col-11"
      if (this.score && this.score.indexOf("%") > -1) {
        this.scoreForBar = Number.parseInt(this.score.replace("%", ""));
      } else {
        if (this.score && this.score.indexOf("M") > -1) {
          if (this.score.startsWith("-")) {
            this.scoreForBar = 0;
          } else {
            this.scoreForBar = 100;
          }
        } else {
          if (this.score) {
            let num = Number.parseFloat(this.score);
            num = (num / 50) * 100;
            num = num + 50;
            if (this.score.startsWith("-")) {
              this.scoreForBar = num > 0 ? num : 0;
            } else {
              this.scoreForBar = num > 100 ? 100 : num;
            }
          }

        }
      }
    } else {
      this.showProgress = "col-0"
      this.adjustProgress = "col-12"
    }
    if (this.fen != this.prevFen) {
      this.imbFen = this.fen
      this.calculateImbalance()
    }

    this.prevFen = this.fen;
  }

  onDrop(source: any, target: any, piece: any) {
    removeAllSquareConnectingArrow(this.boardId)
    if(this.firstSquare && source != target) {
      removeSelectSquare(this.boardId, this.firstSquare)
      this.firstSquare = null;
    }
    if (this.allowPlay) {
      removeGreySquares(this.boardId);
    }

    if (source === target) {
      return
    }
    let promotion = 'q';
    let move = null;
    if (this.chess.get(source).type == 'p' && (target.charAt(1) == '8' || target.charAt(1) == '1')) {
      const dialogRef = this.dialog.open(PromotionDialog, {
        data: { turn: this.chess.turn() },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          promotion = result;
          move = this.chess.move({
            from: source,
            to: target,
            promotion: promotion
          });
          this.movesPlayed.push(move.san);
          this.onMove.emit(this.chess.fen());
          let whiteTurn = this.chess.turn() == 'w';
          let moveDetails = {
            fen: this.chess.fen(),
            move: move,
            whiteTurn: whiteTurn
          }
          this.fen = this.chess.fen();
          this.createBoard();
          this.onMoveEx.emit(moveDetails)
          if (!this.noAudio) {
            this.audioService.playAudio();
          }
          highlightMoves(move, this.boardId);
          resumeScroll();
          return;
        }
      });
    } else {
      // validate move

      if (this.autoQueenPromotion && (piece == 'wP' || piece == 'bP')) {
        if (target.indexOf("8") > -1 || target.indexOf("1") > -1) {
          move = this.chess.move({
            from: source,
            to: target,
            promotion: promotion
          });
        } else {
          move = this.chess.move({
            from: source,
            to: target
          });
        }

      } else {
        move = this.chess.move({
          from: source,
          to: target
        });
      }


      if (move == null) {
        resumeScroll();
        return 'snapback'
      }



      this.movesPlayed.push(move.san);
      this.onMove.emit(this.chess.fen());
      let whiteTurn = this.chess.turn() == 'w';
      let moveDetails = {
        fen: this.chess.fen(),
        move: move,
        whiteTurn: whiteTurn
      }
      this.onMoveEx.emit(moveDetails)
      if (!this.noAudio) {
        this.audioService.playAudio();
      }
      highlightMoves(move, this.boardId);
      setTimeout(()=>resumeScroll(), 400);
      ;
      if (this.chess) {
        this.turn = this.chess.turn();
      }
      if(this.webPainted) {
        setTimeout(() => {
          this.createWebEx(false)
        }, 200);
      }
      if(this.dominationPainted) {
        setTimeout(()=> {
          this.showSupportingSquaresEx(false)
        }, 200)
      }

    }


  }

  public getMovesPlayed() {
    return this.movesPlayed;
  }

  registerMove() {

  }

  public makeMove(san: string) {
    const move = this.chess.move(san);
    if (move == null)
      return false;
    else {
      let fen = this.chess.fen();
      this.movesPlayed.push(move.san);
      if(move.san == "O-O" || move.san == "O-O-O" || move.san.indexOf("=") > -1 || move.san == "O-O+" || move.san == "O-O-O+" || move.enpassent) {
        let squares = this.getCastleMoveSquares(move)
        this.board.move(squares[0])
        this.board.move(squares[1])
      } else {
        this.board.move(move.from + "-" + move.to, false)
      }
      if (!this.noAudio) {
        this.audioService.playAudio();
      }
      highlightMoves(move, this.boardId);
      this.imbFen = fen
      this.turn = this.chess.turn()
      this.calculateImbalance()
      if(this.webPainted) {
        setTimeout(() => {
          this.createWebEx(false)
        }, 200);
      }
      if(this.dominationPainted) {
        setTimeout(()=> {
          this.showSupportingSquaresEx(false)
        }, 200)
      }
      return move != null
    }

  }

  public getFen() {
    return this.chess.fen();
  }

  public makeMoves(sans: string[]) {
    this.chess.reset();
    if (this.studyMode) {
      this.chess.load(this.startingFen)
      this.board.position(this.startingFen)
    }
    let wrongMoveFound = false;
    if (sans && sans.length > 0) {
      for (let i = 0; i < sans.length; i++) {
        const move = this.chess.move(sans[i]);
        if (move == null) {
          wrongMoveFound = true;
          for (let j = 0; j < i; j++) {
            this.chess.undo();
          }
          break;
        } else {
          if(move.san == "O-O" || move.san == "O-O-O" || move.san.indexOf("=") > -1 || move.san == "O-O+" || move.san == "O-O-O+" || move.enpassent) {
            let squares = this.getCastleMoveSquares(move)
            this.board.position(this.chess.fen(), false)

          } else {
            this.board.move(move.from + "-" + move.to, false)
          }

        }
      }
    }
    if (!wrongMoveFound) {
      if (!this.noAudio) {
        this.audioService.playAudio();
      }
      if (this.chess)
        this.turn = this.chess.turn();
      this.imbFen = this.fen
      this.calculateImbalance()
      if(this.webPainted) {
        this.createWebEx(false)
      }
      if(this.dominationPainted) {
        this.showSupportingSquaresEx(false)
      }
    }

  }

  public setInitialPosition(position : string) {
    this.startingFen = position;
  }

  public undoMove() {
    let undoneMove = this.chess.undo();

    if (this.movesPlayed.length > 0) {
      this.movesPlayed.pop();
    }
    let fen = this.chess.fen();
    if (this.boardConfig && this.boardConfig.position) {
      this.boardConfig.position = fen;
      this.board = ChessBoard(this.boardId, this.boardConfig)
    }
    if (this.chess)
      this.turn = this.chess.turn();
    this.imbFen = this.fen
    this.calculateImbalance()
  }

  public loadFen(fen: string) {
    if (!this.boardConfig) {
      this.createBoardConfig()
    }
    this.boardConfig.position = fen;
    this.board = new ChessBoard(this.boardId, this.boardConfig)
    this.chess = new this.Chess(fen)
    try {
      if (removeHighlights)
        removeHighlights(this.boardId)
    } catch (e) { }
    if (this.chess)
      this.turn = this.chess.turn();
    this.imbFen = this.fen
    this.calculateImbalance()
  }

  public resetBoard() {
    this.chess.reset();
    this.createBoardConfig()
    this.boardConfig.position = this.chess.fen();
    this.board = new ChessBoard(this.boardId, this.boardConfig)
    removeHighlights(this.boardId)
    if (this.chess)
      this.turn = this.chess.turn();
    this.imbFen = this.chess.fen()
    this.calculateImbalance()
  }

  toggleAudio() {
    this.noAudio = !this.noAudio;
    if (this.noAudio) {
      this.fabClass = "active-fab"
    } else {
      this.fabClass = "disable-fab"
    }
  }

  getOrientation() {
    return this.board.orientation();
  }

  flipOrientation() {
    //this.orientation = this.orientation == ChessColors.white ? ChessColors.black : ChessColors.white;
    this.boardConfig.orientation = this.board.orientation('flip')
    let orientation = this.board.orientation();
    if (orientation == "white") {
      this.whiteOrientated = true;
    } else {
      this.whiteOrientated = false;
    }
    setOrientation(!this.whiteOrientated, this.boardId)
  }

  toggleAnnotations() {
    if (this.annotationEnabled == "showAnnotations") {
      this.annotationEnabled = "hideAnnotations"
    } else {
      this.annotationEnabled = "showAnnotations"
    }
  }

  setupPositionCompleted() {

  }

  clearAllPieces() {
    this.boardConfig.position = null;
    this.board = ChessBoard(this.boardId, {
      draggable: true,
      dropOffBoard: 'trash',
      pieceTheme: "/assets/pieces/dark-sc/{piece}.webp",
      sparePieces: true
    });
  }

  clearArrows() {
    removeAllSquareConnectingArrow(this.boardId)
  }

  onChangePieceThemeClick(event) {
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.matMenuTrigger.openMenu();
  }

  setPieceTheme(theme) {
    this.pieceTheme = theme;
    localStorage.setItem("pieceTheme", theme)
    if (!this.boardConfig) {
      this.createBoardConfig()
    }
    this.boardConfig.pieceTheme = "/assets/pieces/" + theme + "/{piece}.webp"
    this.boardConfig.position = this.chess.fen()
    this.board = new ChessBoard(this.boardId, this.boardConfig)
  }

  setMoveCategory(a, b) { }
  addMoveComment(a) { }

  calculateImbalance() {
    if (!this.imbFen)
      return
    let tmpFen = this.imbFen.split(" ")[0];
    this.blackImbalance = ""
    this.whiteImbalance = ""
    let wImbArr = []
    let bImbArr = []
    let cnt = tmpFen.length;
    tmpFen = tmpFen.split("p").join("")
    let lCnt = tmpFen.length;
    let bPawnCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("r").join("")
    lCnt = tmpFen.length;
    let bRookCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("n").join("")
    lCnt = tmpFen.length;
    let bKnightCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("b").join("")
    lCnt = tmpFen.length;
    let bBishopCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("q").join("")
    lCnt = tmpFen.length;
    let bQueenCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("P").join("")
    lCnt = tmpFen.length;
    let wPawnCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("R").join("")
    lCnt = tmpFen.length;
    let wRookCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("N").join("")
    lCnt = tmpFen.length;
    let wKnightCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("B").join("")
    lCnt = tmpFen.length;
    let wBishopCount = cnt - lCnt;

    cnt = tmpFen.length;
    tmpFen = tmpFen.split("Q").join("")
    lCnt = tmpFen.length;
    let wQueenCount = cnt - lCnt;

    if (bPawnCount > wPawnCount) {
      this.blackImbalance = "p(" + (bPawnCount - wPawnCount) + ") "
      let imbObj = {
        piece: "P",
        val: (bPawnCount - wPawnCount),
        point: 1

      }
      bImbArr.push(imbObj)
    }
    if (wPawnCount > bPawnCount) {
      this.whiteImbalance = "P(" + (wPawnCount - bPawnCount) + ") "
      let imbObj = {
        piece: "P",
        val: (wPawnCount - bPawnCount),
        point: 1
      }
      wImbArr.push(imbObj)
    }

    if (bRookCount > wRookCount) {
      this.blackImbalance += "r(" + (bRookCount - wRookCount) + ") "
      let imbObj = {
        piece: "R",
        val: (bRookCount - wRookCount),
        point: 5
      }
      bImbArr.push(imbObj)
    }
    if (wRookCount > bRookCount) {
      this.whiteImbalance += "R(" + (wRookCount - bRookCount) + ") "
      let imbObj = {
        piece: "R",
        val: (wRookCount - bRookCount),
        point: 5
      }
      wImbArr.push(imbObj)
    }

    if (bKnightCount > wKnightCount) {
      this.blackImbalance += "n(" + (bKnightCount - wKnightCount) + ") "
      let imbObj = {
        piece: "N",
        val: (bKnightCount - wKnightCount),
        point: 3
      }
      bImbArr.push(imbObj)
    }
    if (wKnightCount > bKnightCount) {
      this.whiteImbalance += "N(" + (wKnightCount - bKnightCount) + ") "
      let imbObj = {
        piece: "N",
        val: (wKnightCount - bKnightCount),
        point: 3
      }
      wImbArr.push(imbObj)
    }

    if (bBishopCount > wBishopCount) {
      this.blackImbalance += "b(" + (bBishopCount - wBishopCount) + ") "
      let imbObj = {
        piece: "B",
        val: (bBishopCount - wBishopCount),
        point: 3
      }
      bImbArr.push(imbObj)
    }
    if (wBishopCount > bBishopCount) {
      this.whiteImbalance += "B(" + (wBishopCount - bBishopCount) + ") "
      let imbObj = {
        piece: "B",
        val: (wBishopCount - bBishopCount),
        point: 3
      }
      wImbArr.push(imbObj)
    }

    if (bQueenCount > wQueenCount) {
      this.blackImbalance += "q(" + (bQueenCount - wQueenCount) + ") "
      let imbObj = {
        piece: "Q",
        val: (bQueenCount - wQueenCount),
        point: 9
      }
      bImbArr.push(imbObj)
    }
    if (wQueenCount > bQueenCount) {
      this.whiteImbalance += "Q(" + (wQueenCount - bQueenCount) + ") "
      let imbObj = {
        piece: "Q",
        val: (wQueenCount - bQueenCount),
        point: 9
      }
      wImbArr.push(imbObj)
    }

    this.bImbObj["imbArr"] = bImbArr
    this.wImbObj["imbArr"] = wImbArr

    let wPoint = 0
    let bPoint = 0
    bImbArr.forEach(imb => {
      bPoint += (imb.val * imb.point)
    })

    wImbArr.forEach(imb => {
      wPoint += (imb.val * imb.point)
    })
    this.wImbObj["total"] = wPoint - bPoint > 0 ? wPoint - bPoint : 0
    this.bImbObj["total"] = bPoint - wPoint > 0 ? bPoint - wPoint : 0
  }

  removeAnnotations() {
    removeAllSquareConnectingArrow(this.boardId);
    removeHighlights(this.boardId)
  }

  downloadSnapshot() {
    PrintDiv(this.boardId, "position.png")
  }

  toggleEval() {
    this.showEval = !this.showEval;
  }

  onMenuClick(event) {
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';
    this.matMenuTrigger.openMenu();
  }

  showSupportingSquares() {
    this.showSupportingSquaresEx(true)
  }

  showSupportingSquaresEx(toggle : boolean) {
    if(this.chess.isCheck()) {
      this.snackbar.open("Domination won't be painted when king is in check", "close")
      return
    }
    if(!this.dominationPainted || (this.dominationPainted && !toggle)) {
      let matrix = getCoverageMatrix(this.chess, this.board.position())

      if(toggle)
        this.dominationPainted = true
      colorDominance(matrix.dominance, this.boardId)
    } else {
      if(toggle)
        this.dominationPainted = false;
      removeDominance(this.boardId)
    }
  }

  createWeb() {
    this.createWebEx(true)
  }

  createWebEx(toggle : boolean) {
    if(this.chess.isCheck()) {
      this.snackbar.open("Web won't be created when king is in check", "close")
      return
    }
    if(!this.webPainted || (this.webPainted && !toggle)) {
      let matrix = getCoverageMatrix(this.chess, this.board.position())
      drawNetwork(matrix, this.board.position(), this.boardId, this.onlyAttacks);
      if(toggle)
        this.webPainted = true;
    } else {
      removeNetwork(this.boardId);
      if(toggle)
        this.webPainted = false;
    }
  }

  getCastleMoveSquares(move : ChessJS.Move) {
    if(move.san != "O-O" && move.san != "O-O-O") {
      return [];
    }
    if(move.to == "g1") {
      return ["e1-g1", "h1-f1"];
    }

    if(move.to == "c1") {
      return ["e1-c1", "a1-d1"];
    }

    if(move.to == "g8") {
      return ["e8-g8", "h8-f8"];
    }

    if(move.to == "c8") {
      return ["e8-c8", "a8-d8"];
    }
  }

  customize(){
    this.router.navigate(['/customize-board'])
  }

  getPosition() {
    return this.board.position();
  }
}
