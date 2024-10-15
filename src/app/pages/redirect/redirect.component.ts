import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  routeMap : any = {
    "collections" : "search",
    "players" : "search",
    "tournaments" : "search",
    "free-chess-explorer" : "tools",
    "free-chess-engine" : "tools",
    "fen-visualizer" : "tools",
    "games" : "tools",
    "download-games" : "tools",
    "play-against-chess-bots" : "tools",
    "openings" : "tools",
    "openings/:eco/:slug" : "tools",
    "pgn-player" : "tools",
    "chess-puzzles":"tools",
    "weekly-games" : "tools",
    "novelty-finder" : "tools",
    "endgame-trainer" : "tools",
    "position-quiz" : "tools",
    "weekly-chesses" : "articles",
    "multiple-chess-games-analyzer":"tools"
  }
  notFound : boolean = false;
  constructor(private route : ActivatedRoute, private router : Router) { }

  ngOnInit(): void {
    let url = this.route.snapshot['_routerState'].url;
    let prefix = this.route.snapshot.url[0].path;
    if(this.routeMap[prefix]) {
      this.router.navigateByUrl("/" + this.routeMap[prefix] + url)
      this.notFound = false;
    } else {
      this.notFound = true;
    }
  }

}
