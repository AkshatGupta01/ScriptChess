import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'src/environments/environment';
import { DelayedScriptLoader } from './delayed-script-loader';
import { ScriptHttpServiceService } from './script-http-service.service';
import { getUniqueId } from '../util/currency';
import { GameCollection } from '../models/game-collection';
import { GameSearchParams } from '../models/game-search-params';
import { Tournament } from '../models/tournament';
import { Post } from '../models/post';


// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// Since I don't have a Type Definition for this demo library, I'm just going to declare
// the interface here and then explicitly cast the global value when I reference it.
interface AnalyticsScript {
  identify( userID: UserIdentifier, traits: UserTraits ) : void;
  track( eventID: EventIdentifier, eventProperties: EventProperties ) : void;
}

export type UserIdentifier = string | number;

export interface UserTraits {
  [ key: string ]: any;
}

export type EventIdentifier = string;

export interface EventProperties {
  [ key: string ]: any;
}


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private scriptLoader: DelayedScriptLoader;
  private gtag : Function;
  private RECORD_OUTBOUND_CLICK = "/outbound-click"
  private CREATE_WEB_APP_STAT = "/web-app-stat"
  private RECORD_BLOG_READ = "/blog-read"
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http : ScriptHttpServiceService) {
    let session = localStorage.getItem("SESSION");
    if(!session) {
      localStorage.setItem("SESSION", getUniqueId(4))
    }
  }

  loadScript() {
    if(environment.production) {
      let scripts = ["https://www.googletagmanager.com/gtag/js?id=G-2QCMCLREZT", "/assets/js/analytics.js"]
      this.scriptLoader = new DelayedScriptLoader(scripts, 6000);
      this.getScript();
    }
  }


  // ---
    // PRIVATE METHODS.
    // ---

    // I return a Promise that resolves with the 3rd-party Analytics Script.
    private async getScript() : Promise<AnalyticsScript> {

      // CAUTION: For the sake of simplicity, I am not going to worry about the case in
      // which the analytics scripts fails to load. Ideally, I might create some sort
      // of "Null Object" version of the analytics API such that the rest of the code
      // can run as expected with various no-op method implementations.
      this.scriptLoader.load().then(()=>{
        this.gtag = ( ( window as any ).gtag as Function );
      })
      // NOTE: Since I don't have an installed Type for this service, I'm just casting
      // Window to ANY and then re-casting the global service that we know was just
      // injected into the document HEAD.
      return( ( window as any ).gtag as AnalyticsScript );

  }

  // I run the given callback after the remote analytics library has been loaded.
  private run( callback: ( analytics: AnalyticsScript ) => void ) : void {

    this.getScript()
        .then( callback )
        .catch(
            ( error ) => {
                console.error(error);
            }
        )
    ;

  }

  // I track the given event for the previously-identified user.
  public track( eventID: EventIdentifier, eventProperties: EventProperties ) : void {

    this.run(
        ( analytics ) => {

            analytics.track( eventID, eventProperties );

        }
    );

  }


  isBrowser() : boolean {
    return isPlatformBrowser(this.platformId);
  }

  recordBannerClick(title: string, index: number) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Banner Click", {
          'event_category': "Click",
          'event_label': "Banner-" + title + "-" + index,
          'value': 0.1
        });
      }
    }
  }

  recordGameClick(game : any, location : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game Click", {
          'event_category': "Click",
          'event_label':  location+ " Game Click",
          'whitePlayer':game.whitePlayer,
          'blackPlayer':game.blackPlayer,
          'categories':game.categories,
          'value': 0.1
        });
      }
    }
  }

  recordCollectionClick(gameCollection : GameCollection, location : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Collection Click", {
          'event_category': "Click",
          'event_label':  gameCollection.name +" clicked on " + location,
          'gameCount': gameCollection.gameIdList.length,
          'value': 0.1
        });
      }
    }
  }

  recordGameSearchClick(searchParam: GameSearchParams) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game Search", {
          'event_category': "search",
          'event_label':  "Game Search",
          'whitePlayer':searchParam.whitePlayer,
          'blackPlayer':searchParam.blackPlayer,
          'categories':searchParam.category,
          'sacrifice':searchParam.sacrifice,
          'value': 0
        });
      }
    }
  }

  recordFenSearchClick(fen : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game Search", {
          'event_category': "search",
          'event_label':  "Fen Search",
          'fen': fen,
          'value': 0
        });
      }
    }
  }

  recordTournamentClick(tournament : Tournament) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Tournament Click", {
          'event_category': "Click",
          'event_label':  tournament.name,
          'value': 0.1
        });
      }
    }
  }

  recordConversion(source : string, target : string, category: string) {
    if(this.isBrowser()){
      if(this.gtag) {
        let url = new URL(target);
        this.gtag('event', "Conversion", {
          'event_category': category,
          'event_label':  url.host,
          'value': 0.13
        });
      }
    }
  }

  recordBlogPageClick(number : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "View", {
          'event_category': 'blog-page',
          'event_label':  number,
          'value': 0.1
        });
      }
    }
  }

  recordBlogRead(blog : Post) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Blog Visit", {
          'event_category': 'View',
          'event_label':  blog.title,
          'value': 0.1
        });
      }
    }
  }

  recordBlogAuthorClick(author : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "View", {
          'event_category': 'blog-author',
          'event_label':  author,
          'value': 0
        });
      }
    }
  }

  recordBlogTagClick(tag : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "View", {
          'event_category': 'blog-tag',
          'event_label':  tag,
          'value': 0.1
        });
      }
    }
  }

  recordBlogSearch(term : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "View", {
          'event_category': 'blog-search',
          'event_label':  term,
          'value': 0
        });
      }
    }
  }

  recordBlogDateClick(date: string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "View", {
          'event_category': 'blog-date',
          'event_label':  date,
          'value': 0
        });
      }
    }
  }

  recordOutboundClick(url : string, position: string) {
    if(this.isBrowser()){
      let outboundAccess = {
        url,
        position
      }
      let link = environment.apiHost + this.RECORD_OUTBOUND_CLICK;
      this.http.doPost(link, null, outboundAccess).subscribe(res=>{

      })
    }
  }


  createWebAppStatByLocation(url : any, location : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Entry", {
          'event_category': 'Landing',
          'event_label':  location,
          'ur':url,
          'value': 0
        });
      }
    }
  }

  recordNoobPlayer() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Noob Player", {
          'event_category': 'Play',
          'event_label':  location,
          'value': 0.1
        });
      }
    }
  }

  recordNoobPlayerGameOver(stat : any) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Noob Player", {
          'event_category': 'Play',
          'event_label':  'game over',
          'moveCount':stat.moveCount,
          'result':stat.result,
          'value': 0.1
        });
      }
    }
  }

  recordOpeningExplorer(openingName : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Opening Explorer", {
          'event_category': 'Visit',
          'event_label':  'Opening Explorer',
          'name':openingName,
          'value': 0.1
        });
      }
    }
  }

  recordOpeningExplorerPlay(openingName : string, playedCount : number) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Opening Explorer", {
          'event_category': 'Play',
          'event_label':  'Opening Explorer Play',
          'name':openingName,
          'moveCount':playedCount,
          'value': 0.1
        });
      }
    }
  }

  recordGameExplorerPlay(playedCount : number, moves : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Opening Explorer", {
          'event_category': 'Play',
          'event_label':  'Opening Explorer Play',
          'moveCount':playedCount,
          'moves':moves,
          'value': 0.1
        });
      }
    }
  }

  recordPgnPlayerVisit() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Pgn Player Visit", {
          'event_category': 'View',
          'event_label':  'Pgn Player Visit',
          'value': 0.1
        });
      }
    }
  }

  recordPgnPlayerUsed() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Pgn Player Visit", {
          'event_category': 'App Used',
          'event_label':  'Pgn Player Used',
          'value': 0.1
        });
      }
    }
  }

  recordFenPlayerVisit() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Fen Player Visit", {
          'event_category': 'View',
          'event_label':  'Fen Player Visit',
          'value': 0.1
        });
      }
    }
  }

  recordFenPlayerUsed() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Fen Player Visit", {
          'event_category': 'App Used',
          'event_label':  'Fen Player Used',
          'value': 0.1
        });
      }
    }
  }

  recordPlayersVisit() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Player Visit", {
          'event_category': 'View',
          'value': 0.1
        });
      }
    }
  }

  recordPlayerSearched(name : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Player Search", {
          'event_category': 'Search',
          'name':name,
          'value': 0
        });
      }
    }
  }

  recordPlayerClicked(name : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Player Clicked", {
          'event_category': 'Click',
          'name':name,
          'value': 0.1
        });
      }
    }
  }

  recordTournamentSearch(name : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Tournament Search", {
          'event_category': 'Search',
          'name':name,
          'value': 0
        });
      }
    }
  }

  recordGameOfWeeksVisit() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game of week", {
          'event_category': 'View',
          'value': 0.1
        });
      }
    }
  }

  recordGameOfWeekVisit(name : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game of week", {
          'event_category': 'View',
          'name':name,
          'value': 0.1
        });
      }
    }
  }

  recordStudyLineInteraction(name : string, playedMoveCount : number) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Study line Interaction", {
          'event_category': 'App Used',
          'name':name,
          'moveCount':playedMoveCount,
          'value': 0.1
        });
      }
    }
  }

  recordLogoClicked(url : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Logo Clicked", {
          'event_category': 'Click',
          'url':url,
          'value': 0
        });
      }
    }
  }

  recordMenuCardClicked(name : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Menu card Clicked", {
          'event_category': 'Click',
          'name':name,
          'value': 0
        });
      }
    }
  }

  recordMenuClicked(name : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Menu Clicked", {
          'event_category': 'Click',
          'name':name,
          'value': 0
        });
      }
    }
  }

  recordSearch(params) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game Search", {
          'event_category': 'Search',
          'params':params,
          'value': 0
        });
      }
    }
  }

  recordBotsClicked(name : string, playerColor : string) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game Played", {
          'event_category': 'Bots',
          'name':name,
          'playerColor':playerColor,
          'value': 0
        });
      }
    }
  }

  recordGameAnalysis(eco : string, moveCount : number) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Game Analysis", {
          'event_category': 'analysis',
          'eco':eco,
          'moveCount':moveCount,
          'value': 0
        });
      }
    }
  }

  recordFreshAnalysis(eco : string, moveCount : number) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Fresh Analysis", {
          'event_category': 'Tools',
          'eco':eco,
          'moveCount':moveCount,
          'value': 0
        });
      }
    }
  }

  recordPositionAnalysis(moveCount : number) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Position Analysis", {
          'event_category': 'Tools',
          'moveCount':moveCount,
          'value': 0
        });
      }
    }
  }

  recordPuzzleSolved(rating) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Puzzle Solved", {
          'event_category': 'Tools',
          'rating':rating,
          'value': 0
        });
      }
    }
  }

  recordPuzzleFailed(rating) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Puzzle Failed", {
          'event_category': 'Tools',
          'rating':rating,
          'value': 0
        });
      }
    }
  }

  recordPuzzleRequested(pageCount) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Puzzles requested", {
          'event_category': 'Toolse',
          'page_count':pageCount,
          'value': 0
        });
      }
    }
  }

  recordPuzzleSearched(theme, rating, piece, opening) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Puzzles Searched", {
          'event_category': 'Tools',
          'rating':rating,
          'theme' : theme,
          'opening' : opening,
          'piece' : piece,
          'value': 0
        });
      }
    }
  }

  recordDailyPuzzleSolved(date) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Daily Puzzle Solved", {
          'event_category': 'Tools',
          'date':date,
          'value': 0
        });
      }
    }
  }

  recordEndgameSearch() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Endgame Searched", {
          'event_category': 'Tools',
          'pieces' : 'all',
          'value': 0
        });
      }
    }
  }

  recordEndgameSearchWithPieces(pieces) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Endgame Searched", {
          'event_category': 'Tools',
          'pieces' : pieces,
          'value': 0
        });
      }
    }
  }

  recordEndgameAnalysis() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Endgame Usage", {
          'event_category': 'Tools',
          'type' : 'Analysis',
          'value': 0
        });
      }
    }
  }

  recordEndgamePlayWithBot() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Endgame Usage", {
          'event_category': 'Tools',
          'type' : 'Play',
          'value': 0
        });
      }
    }
  }

  recordEndgameGameView() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Endgame Usage", {
          'event_category': 'Tools',
          'type' : 'View Game',
          'value': 0
        });
      }
    }
  }

  recordPositionQuizPlay(result) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Position Quiz", {
          'event_category': 'Tools',
          'type' : 'Solving',
          'result' : result,
          'value': 0
        });
      }
    }
  }

  recordChessDotComGamesAnalyzed(filters, count, depth) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Multiple Game Analysis", {
          'event_category': 'Tools',
          'type' : 'Chess.com Games',
          'filters':filters,
          count,
          depth,
          'value': 0
        });
      }
    }
  }

  recordMultipleGamesAnalyzed(filters, count, depth) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Multiple Game Analysis", {
          'event_category': 'Tools',
          'type' : 'PGN  Games',
          'filters':filters,
          count,
          depth,
          'value': 0
        });
      }
    }
  }

  recordAnalyzedPositionPlayed() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Multiple Game Analysis", {
          'event_category': 'Tools',
          'type' : 'Position Played',
          'value': 0
        });
      }
    }
  }

  recordIndividualGameAnalysisVisited() {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Multiple Game Analysis", {
          'event_category': 'Tools',
          'type' : 'Individual game avalysis visited',
          'value': 0
        });
      }
    }
  }

  recordMultiGameAnalysisGameExplorerUsed(index) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Multiple Game Analysis", {
          'event_category': 'Tools',
          'type' : 'Game explorer used',
          'index' : index,
          'value': 0
        });
      }
    }
  }

  recordTrainingRatingUpdated(targetRating) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Training Rating Updated", {
          'event_category': 'Training',
          'type' : 'Training Rating',
          'index' : targetRating,
          'value': 0
        });
      }
    }
  }

  recordTrainingStarted(registered) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Training Started", {
          'event_category': 'Training',
          'type' : 'Training Rating',
          'registrated': registered,
          'value': 0
        });
      }
    }
  }

  recordTrainingCompleted(registered) {
    if(this.isBrowser()){
      if(this.gtag) {
        this.gtag('event', "Training Started", {
          'event_category': 'Training',
          'type' : 'Training Rating',
          'registrated': registered,
          'value': 0
        });
      }
    }
  }

}
