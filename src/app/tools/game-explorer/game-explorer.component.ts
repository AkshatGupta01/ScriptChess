import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/models/game';
import { MoveDetails } from 'src/app/models/move';
import { Player } from 'src/app/models/player';
import { Tournament } from 'src/app/models/tournament';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { metaMap } from 'src/app/static-data/meta';
import { formatMoney } from 'src/app/util/currency';
import { md5 } from 'src/app/util/md5';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { StockfishEval } from 'src/app/models/eval';
import { PositionAnalyzer } from 'src/app/util/position-analyzer';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { EcoModel } from 'src/app/models/eco';
import { findGamePhase } from 'src/app/util/game-phase-finder';
import { FormControl } from '@angular/forms';
const DEPTH : number= 18;
@Component({
  selector: 'app-game-explorer',
  templateUrl: './game-explorer.component.html',
  styleUrls: ['./game-explorer.component.scss']
})
export class GameExplorerComponent implements OnInit, OnDestroy {
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  exploreModeOn : boolean = true;
  ngUnsubscribe = new Subject<void>();
  isLoading : Observable<boolean> = of(false);
  games : Observable<Game[]> | undefined
  moves: MoveDetails[]
  title : string = "";
  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  currentMoveIndex = 0;
  showAllGamesLabel=false;
  currentFen = "";
  error : any;
  prevMoves : string = null;
  gameCount = 0;
  gameCountStr = "";
  movesPlayed : string[] = []
  moveOrder : string = ""
  movesPlayedCount = 0;
  stockfishEval : StockfishEval
  phase : number
  score : string
  positionAnalyzer : PositionAnalyzer;
  opening : string
  openingEnds : boolean = false;
  selectedTab = new FormControl(0);
  constructor(private store : Store, private activatedRoute : ActivatedRoute, private snackBar  :MatSnackBar,
    private meta : Meta, private titleService : Title, private analyticService : AnalyticsService, private service : ScriptChessServiceService) {
    if(this.meta.getTag("description")) {
      this.meta.updateTag({'name': 'description', content: metaMap["Explorer"].description})
    } else {
      this.meta.addTag({'name': 'description', content: metaMap["Explorer"].description})
    }
    this.titleService.setTitle(metaMap["Explorer"].title)
    this.currentFen = this.initialPosition;
  }

  ngOnDestroy(): void {
    this.analyticService.recordGameExplorerPlay(this.movesPlayedCount, this.moveOrder)
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    // let self = this;
    this.activatedRoute.queryParams.subscribe(params=> {
      if(params["fen"]) {
        this.currentFen = params["fen"]
        this.chess = new this.Chess(this.currentFen);
      }
      if(params["moveIndex"])
          this.currentMoveIndex = params["moveIndex"]
      this.onMove(this.currentFen)
    })
  }


  onPlayerSelect(player: Player) {
    this.store.dispatch(new GameAction.FetchGamesOfPlayer(player.playerId))
    this.store.select(GameSelector.selectAllGames).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(games=> {
      if(games) {
        this.games = of(games)
        this.exploreModeOn = false
      }
    })
    this.title = "Games Played by " + player.name
  }

  fetchOpening(moves) {
    if(moves && moves.trim().length > 0) {
      this.service.getOpeningForMoves(moves).subscribe(response=> {
        if(response && response.body) {
            this.opening = response.body["opening"];
        }
      }, error=> {
        this.openingEnds = true;
      })
    }
  }

  onTournamentSelect(tournament: Tournament) {
    this.store.dispatch(new GameAction.FetchGamesOfTournament(tournament.id))
    this.store.select(GameSelector.selectAllGames).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(games=> {
      if(games) {
        this.games = of(games)
        this.exploreModeOn = false
      }
    })
    this.title = "Games Played in " + tournament.name
  }

  onMoveEx(moveDetails: any, board : any) {
    let move = this.chess.move(moveDetails.move.san)
    if(move) {
      this.movesPlayed.push(moveDetails.move.san);
    }
    this.currentFen = this.chess.fen();
    this.onMove(this.currentFen);
  }

  onMove(fen : string) {
    this.movesPlayedCount++;
    this.store.dispatch(new GameAction.FetchMoves(fen));
    this.isLoading = this.store.select(GameSelector.selectIsLoading);
    this.store.select(GameSelector.selectState).pipe(takeUntil(this.ngUnsubscribe)).subscribe(state=> {
      if(state.error) {
          let e= state.error;
          if(e.message.startsWith("404")) {
            this.snackBar.open("Can't find this position", "Close")
          } else {
            this.snackBar.open("Unexpected error occurred", "Close")
          }
      } else {
        if(state.isLoading)
          return
        let moves= state.moves;
        if(moves) {
          let movesStr = Object.keys(moves).join("");
          let cHash = md5(movesStr);
          if(this.prevMoves) {
            if(cHash == this.prevMoves) {
              return;
            } else {
              this.prevMoves = cHash;
            }
          } else {
            this.prevMoves = cHash;
          }


          this.moves = []
          this.gameCount =0;
          this.currentMoveIndex = (this.movesPlayed.length + 1);
          Object.keys(moves).forEach(move => {
            if(moves[move]["count"] > 0) {
              this.moves.push(moves[move])
              this.gameCount+=moves[move].count;
            }

          })

          this.gameCountStr = formatMoney(this.gameCount);

          if(this.gameCount <= 1000) {

            this.showAllGamesLabel=true;
          } else {
            this.showAllGamesLabel=false;
          }
        }
        this.moves.sort(function(a : MoveDetails, b: MoveDetails) {
          return b.count - a.count;
        })
      }
    })
    if(!this.positionAnalyzer) {
      this.positionAnalyzer = new PositionAnalyzer(fen, DEPTH, (stockfishEval)=> {
        this.stockfishEval = stockfishEval
      }, (score)=> {
        this.score = score;
      })
    } else {
      this.positionAnalyzer.runNewStockFishEvalForFen(fen)
    }
    this.phase = findGamePhase(fen);

    this.createMoveOrder();

    this.fetchOpening(this.moveOrder.trim());
  }

  onMoveSelect(move, board) {
    let chessMove = this.chess.move(move)
    if(chessMove) {
      this.movesPlayed.push(move);
    }
    this.currentFen = this.chess.fen();
    this.onMove(this.currentFen);
  }

  undo(board) {
    if(this.movesPlayed.length > 0) {
      this.chess.undo();
      this.movesPlayed.pop();
      this.currentFen = this.chess.fen();
      this.onMove(this.currentFen);
    }
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
    } else {
      this.moveOrder = "";
    }
  }


}
