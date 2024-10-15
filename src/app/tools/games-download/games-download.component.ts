import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';
import { ScriptHttpServiceService } from 'src/app/services/script-http-service.service';

declare function saveData(pgn, fileName)

@Component({
  selector: 'app-games-download',
  templateUrl: './games-download.component.html',
  styleUrls: ['./games-download.component.scss']
})
export class GamesDownloadComponent implements OnInit {

  metadata : any[] = []
  username : string = ""
  metadataMonths : any[] = []
  error : string = null;
  downloadStarted = false;
  constructor(private service : ScriptChessServiceService, private http : ScriptHttpServiceService, private router : Router) { }

  ngOnInit(): void {

  }

  fetchGameMetadata() {
    if(this.username && this.username.trim().length > 0) {
      let archiveLink = "https://api.chess.com/pub/player/"+this.username+"/games/";
      this.downloadStarted = true;
      this.service.fetchChessComGamesMetaData(this.username).subscribe(res=> {
        if(res && res.body) {
          this.error = null;
          this.metadata = res.body.archives;
          this.metadata.forEach((m : string)=> {
            let url = m.toLocaleLowerCase().replace(archiveLink.toLocaleLowerCase(), "")
            let dt = url.split("/");
            let date = this.getMonth(dt[1]) + "-" + dt[0];
            this.metadataMonths.push({
              date : date,
              link : m
            })
          })

          this.metadataMonths = this.metadataMonths.sort((a,b)=>{
            let aDateObj = new Date(Date.parse(a.date));
            let bDateObj = new Date(Date.parse(b.date));
            return (bDateObj.getFullYear() * 365 + (bDateObj.getMonth() + 1) * 30) - (aDateObj.getFullYear() * 365 + (aDateObj.getMonth() + 1) * 30)
          })
        }
        this.downloadStarted = false;
      },e=> {
        this.metadata = []
        this.metadataMonths = []
        this.error = "Failed to fetch games for " + this.username
        this.downloadStarted = false;
      })
    }
  }

  getMonth(numStr) {
    let num = Number.parseInt(numStr);
    switch(num) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sep";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
    }
  }

  downloadPgn(link, date) {
    let pgn = "";
    this.http.doGet(link, []).subscribe(res=> {
      if(res && res.body) {
        let gamesArr = res.body["games"];
        if(gamesArr && gamesArr.length > 0) {
          gamesArr.forEach(g=> {
            pgn +=`
            `;
            pgn += g.pgn;
          })
        }
        saveData(pgn, "chess.com-"+date+".pgn");
      }
    })
  }

  analyzeGames(date : string) {
    let dateObj = new Date(Date.parse(date));
    let month = dateObj.getMonth() +1;
    let year = dateObj.getFullYear();
    this.router.navigate(["/tools/multiple-chess-games-analyzer"],{queryParams: {"year":year, "month" : month,"ref" : "chess.com", "username" : this.username}})
  }

}
