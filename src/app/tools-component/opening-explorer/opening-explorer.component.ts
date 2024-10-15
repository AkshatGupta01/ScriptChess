import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { MoveDetails } from 'src/app/models/move';
import { EcoModel } from 'src/app/models/eco';
import { generateRandomID } from 'src/app/util/strings';
import { Router } from '@angular/router';
import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-opening-explorer',
  templateUrl: './opening-explorer.component.html',
  styleUrls: ['./opening-explorer.component.scss']
})
export class OpeningExplorerComponent implements OnInit, OnDestroy {

  @Input()
  eco : string

  @Input()
  openingName : string = ""
  currentName : string = ""
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  fenMovesMap = {}
  currentMoves : any[]
  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  currentFen : string = this.initialPosition;
  playedFens : string[] = []
  playedMoves : string[] = []
  allFensLoaded : boolean
  allGamesFetched : boolean
  noMoveAvailable : boolean = true;
  boardId : string
  moveOrder = ""
  currentMoveIndex = 1;
  fenOpeningNameMap = {}
  movesLoaded = false;
  movesPlayed : [];
  movesPlayedCount = 0;
  constructor(private service : ScriptChessServiceService, private router : Router, private analyticService : AnalyticsService) {
    this.boardId = generateRandomID(5).trim();
  }

  ngOnDestroy(): void {
    this.analyticService.recordOpeningExplorerPlay(this.openingName, this.movesPlayedCount)
  }

  ngOnInit(): void {
    this.currentName = this.openingName;
    this.service.getAllLinesOfOpening(this.eco).subscribe(response=>{
      if(response && response.body && response.body.length > 0) {
        this.prepareExplorer(response.body)

      }
    })
  }

  prepareExplorer(ecoModels : EcoModel[]) {
    if(ecoModels && ecoModels.length > 0) {
      ecoModels.forEach(model=> {
        this.chess.reset();
        this.chess.loadPgn(model.moves);
        let sans = this.chess.history();
        this.chess.reset();
        sans.forEach(san=> {
          let fen = this.chess.fen();
          let moveDetail = {
            move : san
          }
          if(this.fenMovesMap[fen]) {
            if(!this.fenMovesMap[fen].moves) {
              this.fenMovesMap[fen].moves = []
            }
            let matched = false;
            this.fenMovesMap[fen].moves.forEach(move=> {
              if(move.move == san) {
                matched = true;
              }
            })
            if(!matched) {
              this.fenMovesMap[fen].moves.push(moveDetail)
            }
          } else {
            this.fenMovesMap[fen] = {}
            this.fenMovesMap[fen].moves = []
            this.fenMovesMap[fen].moves.push(moveDetail)
          }
          this.chess.move(san);
          fen = this.chess.fen();
          this.fenOpeningNameMap[fen] = model.name;
        })
      })
    }
    this.currentMoves = this.fenMovesMap[this.currentFen].moves;
    this.movesLoaded = true;
    if(this.currentFen) {
      this.noMoveAvailable = false;
    }
  }

  onMoveSelect(move, board) {
    board.makeMove(move);
    let fen= board.getFen();
    this.onMove(fen, board)
  }

  undo(board) {
    board.undoMove();
    let fen = board.getFen()
    this.onMove(fen, board);
    if(this.currentMoveIndex > 1) {
      this.currentMoveIndex--;
    }
  }

  onMove(fen : string, board: any) {
    if(this.fenMovesMap[fen]) {
      this.currentMoves = this.fenMovesMap[fen].moves;
      this.currentName = this.fenOpeningNameMap[fen];
    } else {
      this.noMoveAvailable = true;
      this.currentMoves = []
    }

    if(board) {
      this.currentFen = board.getFen();
      this.movesPlayed = board.getMovesPlayed();
      this.createMoveOrder();
    }
    this.currentMoveIndex++;
    this.movesPlayedCount++;
  }

  createMoveOrder() {
    if(this.movesPlayed.length > 0) {
      let moveSeq = "";
      for(let index=1; index<=this.movesPlayed.length; index++) {
      if(index % 2 != 0) {
        let moveNum = index / 2;
        moveNum = Math.ceil(moveNum)
        moveSeq = moveSeq + " " + moveNum + ". " + this.movesPlayed[index -1]
      } else {
        moveSeq = moveSeq + " " + this.movesPlayed[index -1]
      }
    }
    this.moveOrder = moveSeq;
    }
  }

  goGameExplorer() {
    this.router.navigate(["/free-chess-explorer"],{queryParams:{fen:this.currentFen, moveIndex: this.currentMoveIndex}})
  }
}
