import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Endgame } from 'src/app/models/endgame';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-endgame-finder',
  templateUrl: './endgame-finder.component.html',
  styleUrls: ['./endgame-finder.component.scss']
})
export class EndgameFinderComponent implements OnInit {

  pawnChecked : boolean
  rookChecked : boolean
  knightChecked : boolean
  bishopChecked : boolean
  queenChecked : boolean
  player : string
  page = 0
  endgames : Endgame[] = []
  fetchingEndgames : boolean = false;
  MAX_COUNT = 30;
  noMore = false;
  constructor(private service :ScriptChessServiceService, private snackbar : MatSnackBar, private analytics : AnalyticsService) { }

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.fetchingEndgames = true;
    let pieces = "";
    if(this.pawnChecked) {
      pieces = "p"
    }
    if(this.rookChecked) {
      pieces = pieces+",r"
    }
    if(this.knightChecked) {
      pieces = pieces+",n"
    }
    if(this.bishopChecked) {
      pieces = pieces+",b"
    }
    if(this.queenChecked) {
      pieces = pieces+",q"
    }
    pieces = pieces.startsWith(",") ? pieces.substring(1) : pieces;
    if(pieces.trim().length == 0 && (!this.player || this.player.trim().length == 0)) {
      this.analytics.recordEndgameSearch()
      this.service.fetchEndGames(this.page).subscribe(res=> {
        this.fetchingEndgames = false;
        this.endgames = res.body;
        this.noMore = this.endgames.length < this.MAX_COUNT
        if(this.endgames.length == 0) {
          this.fetchingEndgames = true;
          this.page = 0;
          this.search();
        }
      })
    } else {
      this.service.searchEndGames(this.page, pieces, this.player).subscribe(res=> {
        this.analytics.recordEndgameSearchWithPieces(pieces)
        this.fetchingEndgames = false;
        this.endgames = res.body;
        this.noMore = this.endgames.length < this.MAX_COUNT
        if(this.endgames.length == 0 && (pieces.indexOf("p") < 0 ||  pieces.indexOf("P") < 0)) {
          this.snackbar.open("No result found, Try selecting pawns as well",  "close")
        } else {
          if(this.endgames.length == 0) {
            this.fetchingEndgames = true;
            this.page = 0;
            this.search();
          }

        }
      })
    }
  }

  next() {
    this.page++
    this.search()
  }


}
