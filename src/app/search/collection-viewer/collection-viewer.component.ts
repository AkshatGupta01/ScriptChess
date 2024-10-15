import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Game } from 'src/app/models/game';
import { GameCollection } from 'src/app/models/game-collection';
import { MoveDetails } from 'src/app/models/move';
import { GameCollectionAction, GameCollectionSelector } from 'src/app/rx/collections';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { StockfishPositionAnalyzer } from 'src/app/util/stockfish-position-analyzer';
import { environment } from 'src/environments/environment';
import { getStockfishPath } from 'src/app/util/stockfish-util';

@Component({
  selector: 'app-collection-viewer',
  templateUrl: './collection-viewer.component.html',
  styleUrls: ['./collection-viewer.component.scss']
})
export class CollectionViewerComponent implements OnInit, OnDestroy {
  collection : GameCollection
  allFensLoaded : boolean
  allGamesFetched  :boolean
  filteredGamesFetched : boolean
  currentMoveIndex : number
  currentMoves : MoveDetails[]
  filteredGames : Game[]
  isLoading : boolean = true;
  ngUnsubscribe = new Subject<void>();
  fenMovesMap = {}
  initialPosition = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();
  currentFen : string = this.initialPosition;
  playedFens : string[] = []
  playedMoves : string[] = []
  displayedColumns : string[] = ["whitePlayer","blackPlayer", "year", "eco", "tournament", "result","moveCount","categories", "sacrifices","gameLink" ]
  showExplorer : boolean = true
  noMoveAvailable : boolean
  collectionSlug : string = null;
  stockfishPositionAnalyzer = null;
  score = "10"
  depth: any;
  self = null;
  turn: string;
  engineWorker: any;
  engineRegistered: boolean;
  bestMovePatter = /^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/
  scorePattern = /^info depth (\d+) .*\bscore (\w+) (-?\d+).*\bpv (.*)/
  engineOn = false;
  engineStarted = false;
  constructor(private activatedRoute : ActivatedRoute, private store : Store, private service : ScriptChessServiceService,
    private analyticService : AnalyticsService, private cd : ChangeDetectorRef) {
    this.depth = environment.gameAnalysisDepth;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    if(this.engineOn && this.engineWorker) {
      this.engineWorker.terminate();
    }
  }

  onScoreUpdater(score) {
    this.score = score;
    if(this.cd) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void {
    this.self = this;
    this.activatedRoute.params.subscribe(params=> {
      let collectionId = params["collectionId"]
      let collectionName = params["collectionName"]
      this.store.dispatch(new GameCollectionAction.FetchGameCollection(collectionId))
      this.store.select(GameCollectionSelector.selectCurrentGameCollection).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(collection=> {
        if(collection) {
          this.collection = collection;
          this.fetchFullGames(this.collection)
        }
      })
      this.store.select(GameCollectionSelector.selectIsLoading).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(loading=> {
        this.isLoading = loading;

      })
    })
  }

  fetchFullGames(collection : GameCollection) {
    this.filteredGamesFetched = false;
    let ids = "";
    collection.gameIdList.forEach(id=> {
      ids = ids + id+",";
    })
    ids = ids.substring(0, ids.length -1)
    this.service.fetchAllGames(ids).subscribe(gamesResponse => {
      this.allGamesFetched = true;
      this.filteredGames = gamesResponse.body;
      this.fenMovesMap = {}
      this.filteredGames.forEach(game=> {
        this.chess.reset();

          game.moves.forEach(move=> {
            let fen = this.chess.fen();
            let moveDetail = {
              move : move.move,
              whiteWins : 0,
              blackWins : 0,
              draws : 0,
              count : 1,
              games : []
            }
            moveDetail.games.push(game)
            if(game.result == "1-0") {
              moveDetail.whiteWins = 1
            } else {
              if(game.result == "0-1") {
                moveDetail.blackWins = 1
              } else {
                moveDetail.draws = 1
              }
            }
            if(this.fenMovesMap[fen]) {
              let matched = false;
              if(!this.fenMovesMap[fen].moves) {
                this.fenMovesMap[fen].moves = []
              }
              for(let m of this.fenMovesMap[fen].moves) {
                if(m.move == move.move) {
                  m.whiteWins = m.whiteWins + moveDetail.whiteWins
                  m.blackWins = m.blackWins + moveDetail.blackWins
                  m.draws = m.draws + moveDetail.draws
                  m.count = m.whiteWins + m.blackWins + m.draws
                  if(!m.games) {
                    m.games = []
                  }
                  m.games.push(game)
                  matched = true;
                  break;
                }
              }
              if(!matched) {
                this.fenMovesMap[fen].moves.push(moveDetail);
              }
            } else {
              this.fenMovesMap[fen] = {
                moves : []
              }
              this.fenMovesMap[fen].moves.push(moveDetail);
            }
            this.chess.move(move.move)
          })
          //this.stockfishPositionAnalyzer = new StockfishPositionAnalyzer(this.onScoreUpdater, this.depth, this.cd)

      })
      this.allFensLoaded = true;
      this.filteredGamesFetched = true;
      this.chess.reset();
      this.currentFen = this.chess.fen();
      this.currentMoves = this.fenMovesMap[this.currentFen].moves
      this.currentMoveIndex = 1;
      this.currentMoves.sort(function(a : MoveDetails, b: MoveDetails) {
        return b.count - a.count;
      })
      this.filteredGames = []
      this.currentMoves.forEach(m=> {
        this.filteredGames.push(...m.games);
      })
    })
    this.playedFens.push(this.initialPosition)
  }

  onMoveEx(moveDetails) {
    if(this.fenMovesMap[moveDetails.fen]) {
      this.filteredGames = [];
      this.currentFen = moveDetails.fen;
      this.currentMoves = this.fenMovesMap[this.currentFen].moves;
      this.currentMoveIndex++;
      this.currentMoves.sort(function(a : MoveDetails, b: MoveDetails) {
        return b.count - a.count;
      })
      this.currentMoves.forEach(m=> {
        this.filteredGames.push(...m.games);
      })
      this.playedFens.push(this.currentFen)
      this.playedMoves.push(moveDetails.move.san)
    } else {
      this.playedFens.push(this.currentFen)
      this.playedMoves.push(moveDetails.move.san)
      this.noMoveAvailable = true;
      this.currentFen = moveDetails.fen;
      this.currentMoves = null;
    }
    this.runStockFishForFen(moveDetails.fen);
  }

  undo(board) {
    if(this.playedFens.length > 1) {
      this.playedFens.pop()
      this.playedMoves.pop()
      board.undoMove();
      this.chess.undo();
      this.currentFen = this.playedFens[this.playedFens.length -1];
      this.currentMoves = this.fenMovesMap[this.currentFen].moves;
      this.currentMoveIndex--;
      this.currentMoveIndex = this.currentMoveIndex == 0 ? 1 : this.currentMoveIndex;
    }
  }

  onMoveSelect(move, board) {
    board.makeMove(move);
    let fen= board.getFen();
    this.currentFen = fen;
    let moveDetails = {
      fen : fen,
      move : move
    }
    this.onMoveEx(moveDetails)
  }

  toggleExplorer(event) {
    this.showExplorer = !event.checked;
  }

  recordGameClick(game : any) {
    this.analyticService.recordGameClick(game, "Collection-viewer")
  }

  registerStockFish() {
    if (typeof Worker !== 'undefined') {
        this.engineWorker = new Worker(new URL(getStockfishPath()));
        this.engineWorker.onmessage = ({ data }) => {
            if(data === "uciok") {
                this.engineRegistered = true;
                if(this.currentFen) {
                  this.runStockFishForFen(this.currentFen)
                }
            } else {
                let match = data.match(this.scorePattern);
                if(match) {
                    //calculate and assign score
                    let chessForEngine = new this.Chess(this.currentFen);
                    var tmpScore = parseInt(match[3]) * (chessForEngine.turn() == 'w' ? 1 : -1);
                    if(match[2] == 'cp') {
                        tmpScore = (tmpScore / 100.0)
                        this.score = tmpScore.toFixed(2);

                    } else if(match[2] == 'mate') {
                        let score = "";
                        if(this.turn == 'w') {
                          this.score = "+M" + tmpScore
                        } else {
                          this.score = "-M" + tmpScore
                        }
                    }
                } else {
                    if(data && (data+"").startsWith("bestmove")) {
                        this.cd.markForCheck();
                    }
                }
            }
        }

        this.engineWorker.postMessage("uci")
    }
  }

  runStockFishForFen(fen : string) {
      if(this,this.engineOn) {
        this.chess = new this.Chess(fen);
        this.turn = this.chess.turn();
        this.engineWorker.postMessage('stop');
        this.engineWorker.postMessage('position fen ' + fen);
        this.engineWorker.postMessage(`go depth ` + this.depth)
      }
  }

  startEngine(value) {
    this.engineOn = value.checked;
    if(this.engineOn) {
      this.registerStockFish();
    } else {
      if(!this.engineOn) {
        this.engineWorker.terminate();
      }
    }
  }

}
