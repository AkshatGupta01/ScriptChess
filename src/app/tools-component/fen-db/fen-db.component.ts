import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MoveDetails } from 'src/app/models/move';
import { GameAction, GameSelector } from 'src/app/rx/games';
import { formatMoney } from 'src/app/util/currency';
import { md5 } from 'src/app/util/md5';

@Component({
  selector: 'app-fen-db',
  templateUrl: './fen-db.component.html',
  styleUrls: ['./fen-db.component.scss']
})
export class FenDbComponent implements OnInit, OnDestroy {

  @Input()
  currentFen: string
  gameCountStr  :string
  isLoading: Observable<boolean>;
  ngUnsubscribe = new Subject<void>();
  prevMoves : string = null;
  moves: MoveDetails[] 
  gameCount = 0;

  @Input()
  currentMoveIndex = 0;
  showAllGamesLabel: boolean;
  gameIsNew : boolean = false;
  @Output()
  onNoMove = new EventEmitter<string>();

  constructor(private store : Store) { }

  ngOnInit(): void {
  }

  ngOnChanges()	{
    this.fetchMovesOnFen();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  fetchMovesOnFen() {
    this.store.dispatch(new GameAction.FetchMoves(this.currentFen));
    this.isLoading = this.store.select(GameSelector.selectIsLoading);
    this.store.select(GameSelector.selectState).pipe(takeUntil(this.ngUnsubscribe)).subscribe(state=> {
      if(state.error) {
        this.gameIsNew = true;
        this.onNoMove.emit();
      } else {
        this.gameIsNew = false;
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
  }

}
