import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Tournament } from 'src/app/models/tournament';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { tournaments } from 'src/app/static-data/tournament';

@Component({
  selector: 'app-tournament-finder',
  templateUrl: './tournament-finder.component.html',
  styleUrls: ['./tournament-finder.component.scss']
})
export class TournamentFinderComponent implements OnInit {

  @Input()
  allTournaments : Tournament[] | undefined
  upcomingTournaments : Tournament[] = []
  onGoingTournaments : Tournament[] = []
  concludedTournaments : Tournament[] = []
  displayedColumns: string[] = ['name', 'site', 'year', 'source', 'hasGames', 'checkGames'];
  arranged = false;
  value = 'Clear me';
  constructor(private analyticService : AnalyticsService, private store : Store) { }

  ngOnInit(): void {
    this.allTournaments.forEach(t=> {
      let sDate = null;
      let eDate = null;
      if(t.startDate) {
        sDate = new Date(Date.parse(t.startDate))        
      } 
      if(t.endDate) {
        eDate = new Date(Date.parse(t.endDate))        
      }

      if(sDate && eDate) {
        let today = new Date();
        if(today > sDate && today < eDate) {
          this.onGoingTournaments.push(t);
        } else {
          if(today < sDate) {
            this.upcomingTournaments.push(t)
          } else {
            if(today > eDate) {
              
              this.concludedTournaments.push(t);
            }
          }
        }
      } else {
        this.concludedTournaments.push(t);
      }
      
    })
    if(this.concludedTournaments.length > 1) {
      this.concludedTournaments.sort(function(a : Tournament, b: Tournament) {
        return b.year - a.year;
      })
    }

    if(this.onGoingTournaments.length > 1) {
      this.onGoingTournaments.sort(function(a : Tournament, b: Tournament) {
        return b.year - a.year;
      })
    }

    if(this.upcomingTournaments.length > 1) {
      this.upcomingTournaments.sort(function(a : Tournament, b: Tournament) {
        return b.year - a.year;
      })
    }
    this.arranged = true;
  }

  recordTournamentClick(tournament : Tournament) {
    this.analyticService.recordTournamentClick(tournament);
  }
}
