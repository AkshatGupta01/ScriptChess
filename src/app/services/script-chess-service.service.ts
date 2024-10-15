import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Banner } from '../models/banner';
import { Game } from '../models/game';
import { Player } from '../models/player';
import { Page, Post } from '../models/post';
import { ScriptHttpServiceService } from './script-http-service.service';
import { menuItems } from 'src/app/static-data/special-menu';
import { menuItems as studies } from 'src/app/static-data/studies';
import { menuItems as playersTournamentsMenu } from 'src/app/static-data/playersTournamentsMenu';
import { menuItems as beginnersMenu } from 'src/app/static-data/beginnerMenu';
import { Tournament } from '../models/tournament';
import { Study } from '../models/study';
import { ECO, EcoModel } from '../models/eco';
import { GameSearchParams } from '../models/game-search-params';
import { GameCollection } from '../models/game-collection';
import { Calender } from '../models/calender';
import { Puzzle } from '../models/puzzle';
import { Feedback } from '../models/feedback';
import { Comment } from '../models/comment';
import { md5 } from '../util/md5';
import { Endgame } from '../models/endgame';
import { generateRandomID } from '../util/strings';
import { User } from '../models/user';
import { Auth } from '../models/auth';
import { TrainingReport } from '../models/training';
import { BulkAnalyzerSummary } from '../models/bulk-analyzer-summary';

@Injectable({
  providedIn: 'root'
})
export class ScriptChessServiceService {
  private PARSE_PGN : string = "/games/parse"
  private FETCH_PAGE : string = "/pages?slug={1}"
  private FETCH_WEEKLY_CHESS : string = "//weekly-chesses?slug={1}"
  private FETCH_WEEKLY_CHESSES : string = "//weekly-chesses"
  private FETCH_GAME : string = "/games/{1}"
  private FETCH_COLLECTIONS : string = "/games/collections"
  private FETCH_GAMES_OF_PLAYERS : string = "/games/players/{1}"
  private FETCH_GAMES_OF_TOURNAMENT : string = "/games/tournaments/{1}"
  private FETCH_GAMES_OF_MOVE : string = "/games?moves={1}"
  private FETCH_MOVES_OF_POSITION : string = "/games/fen?fen={1}"
  private FETCH_BANNERS : string = "/banners"
  private FETCH_POSTS : string = "/articles"
  private FETCH_STUDIES : string = "/studies"
  private FETCH_STUDY : string = "/studies/{1}"
  private FETCH_POST : string = "/articles/{1}"
  private FETCH_PLAYERS = "/players"
  private SEARCH_PLAYERS = "/players/search?name={1}"
  private SEARCH_GAMES = "/games/search?page={1}&count={2}"
  private FETCH_PLAYER = "/players/{1}"
  private FETCH_TOURNAMENT = "/tournaments/{1}"
  private SEARCH_TOURNAMENT = "/tournaments/search?term={1}"
  private FETCH_TOURNAMENTS = "/tournaments"
  private FETCH_TOP_OPENINGS = "/ecos/top?count={1}"
  private FETCH_ALL_OPENINGS = "/ecos/all?count={1}"
  private FETCH_TOP_OPENING = "/ecos/?eco={1}"
  private FETCH_TOP_OPENING_BY_ID = "/ecos/{1}"
  private FETCH_TOP_OPENING_ALL_LINES = "/ecos/{1}/all"
  private SEARCH_GAMES_FROM_POSITION= "/games?fen={1}&page={2}&count={3}"
  private FETCH_GAME_COLLECTION = "/collections/{1}"
  private FETCH_GAME_COLLECTIONS = "/collections?page={1}&count={2}"
  private FETCH_GAME_COLLECTIONS_WITH_CATEGORY = "/collections?page={1}&count={2}&category={3}"
  private FETCH_ALL_GAMES = "/games/all?ids={1}"
  private SEARCH_OPENING = "/ecos/search?term={1}"
  private FETCH_OPENING_FOR_FEN = "/ecos/fen?fen={1}"
  private FETCH_OPENING_FOR_MOVES = "/ecos/moves?moves={1}"
  private FETCH_CALENDER_BY_PLAYER = "/calenders??filters[$or][0][white][$eq]={1}&filters[$or][1][black][$eq]={2}&filters[$and][2][date][$gte]={3}"
  private FETCH_CALENDER_BY_DATE = "/calenders??filters[$or][0][date][$eq]={1}"
  private FETCH_CALENDER_BY_TOURNAMENT = "/calenders??filters[$or][0][tournamentId][$eq]={1}"
  private FETCH_TODAY_PUZZLE = "/puzzle-of-the-day"
  private FETCH_PUZZLE_ON_THE_DAY = "/puzzle-of-the-day?date={1}"
  private SEARCH_PUZZLES = "/puzzles"
  private SEARCH_BLINDFOLD_PUZZLES = "/puzzles/blindfold?rating={1}&page={2}&count={3}"
  private SEARCH_PUZZLES_BULK = "/puzzles/bulk/{1}"
  private FETCH_WEEKS_PGN = "/weeks-pgn"
  private FETCH_WEEKS_GAMES = "/weeks-games?page={1}&count={2}"
  private FETCH_MOVES_FROM_POSITION_FROMWEEKLY_GAME = "/games/fen/weekly?fen={1}"
  private SUBMIT_FEEDBACK = "/feedbacks"
  private SUBMIT_COMMENT = "/comments"
  private FETCH_COMMENT = "/comments?parentType={1}&parentSlug={2}"
  private UPDATE_PUZZLE_EVAL = "/puzzles/eval?token={1}"
  private FETCH_ENDGAME = "/endgames?page={1}&count=30"
  private SEARCH_ENDGAME = "/endgames/search?page={1}&count=30"
  private RECORD_ANALYTICS = "/analytics"
  private FETCH_CHESS_COM_GAMES_METADATA = "https://api.chess.com/pub/player/{1}/games/archives"
  private DOWNLOAD_PARSED_CHESS_COM_GAMES = "/chess-com-games?year={1}&month={2}&username={3}"
  private DOWNLOAD_PARSED_LICHESS_GAMES = "/lichess-games?username={1}"
  private SIGN_UP = "/sign-up"
  private SIGN_IN = "/sign-in"
  private CHECK_USERNAME = "/check-username?username={1}"
  private CHECK_EMAIL = "/check-email?email={1}"
  private REQUEST_PASSWORD_RESET_TOKEN = "/send-password-verification-email?username={1}"
  private UPDATE_PASSWORD = "/update-password?username={1}&token={2}&password={3}"
  private CREATE_TRAINING = "/trainings?userId={1}"
  private UPDATE_TRAINING = "/trainings?userId={1}"
  private DELETE_TRAINING = "/trainings?trainingId={1}"
  private ACTIVE_TRAINING = "/trainings-active?userId={1}"
  private SAVE_GAME_INSIGHT = "/game-insights?userId={1}"
  private FETCH_GAME_INSIGHTS = "/game-insights?userId={1}"
  private FETCH_GAME_INSIGHT = "/game-insights/{1}"
  private UPDATE_PREF = "/users/pref"
  private DELETE_INSIGHT = "/game-insights/{1}"

  constructor(private http : ScriptHttpServiceService) { }
  public getHttpService() {
    return this.http;
  }
  public getGame(gameId : string) {
    let path = environment.apiHost + this.FETCH_GAME.replace("{1}", gameId);
    return this.http.doGet<Game>(path, null);
  }

  public getGamesOfPlayers(playerId : string) {
    let path = environment.apiHost + this.FETCH_GAMES_OF_PLAYERS.replace("{1}", playerId);
    return this.http.doGet<Game[]>(path, null);
  }

  public getGamesOfTournaments(tournamentId : string) {
    let path = environment.apiHost + this.FETCH_GAMES_OF_TOURNAMENT.replace("{1}", tournamentId);
    return this.http.doGet<Game[]>(path, null);
  }

  public getGamesOfMoves(moves : string) {
    let base64OfMoves = btoa(moves);
    let path = environment.apiHost + this.FETCH_GAMES_OF_MOVE.replace("{1}", base64OfMoves);
    return this.http.doGet<Game[]>(path, null);
  }

  public getMovesOfPosition(fen : string) {
    let base64OfFen = btoa(fen);
    base64OfFen = encodeURI(base64OfFen);
    let path = environment.apiHost + this.FETCH_MOVES_OF_POSITION.replace("{1}", base64OfFen);
    return this.http.doGet<any[]>(path, null);
  }

  getArticles(offset : number, maxCount: number) {
    let url = environment.blogHost + this.FETCH_POSTS;
    url=url+"?_limit="+maxCount+"&_sort=published_at:desc&_start="+offset
    return this.http.doGet<Post[]>(url,[]);
  }

  getBanners() {
    let url = environment.blogHost + this.FETCH_BANNERS;
    return this.http.doGet<Banner[]>(url,[]);
  }

  getPost(postId : string) {
    let url = environment.blogHost + this.FETCH_POST;
    url = url.replace("{1}", postId)
    return this.http.doGet<Post>(url,[]);
  }

  getPlayers() {
    let url = environment.apiHost + this.FETCH_PLAYERS;
    return this.http.doGet<Player[]>(url,[]);
  }

  getPlayer(playerId : string) {
    let url = environment.apiHost + this.FETCH_PLAYER;
    url = url.replace("{1}", playerId)
    return this.http.doGet<Player>(url,[]);
  }

  getTournaments() {
    let url = environment.apiHost + this.FETCH_TOURNAMENTS;
    return this.http.doGet<Tournament[]>(url,[]);
  }

  getTournament(tournamentId : string) {
    let url = environment.apiHost + this.FETCH_TOURNAMENT;
    url = url.replace("{1}", tournamentId)
    return this.http.doGet<Tournament>(url,[]);
  }

  getCollections() {
    // let url = environment.blogHost + this.FETCH_PLAYERS;
    // return this.http.doGet<Player[]>(url,[]);
    return of(menuItems);
  }

  getPosts() {
    // let url = environment.blogHost + this.FETCH_PLAYERS;
    // return this.http.doGet<Player[]>(url,[]);
    return of(studies);
  }

  getPlayersTournamentsMenu() {
    // let url = environment.blogHost + this.FETCH_PLAYERS;
    // return this.http.doGet<Player[]>(url,[]);
    return of(playersTournamentsMenu);
  }

  getBeginnersMenu() {
    // let url = environment.blogHost + this.FETCH_PLAYERS;
    // return this.http.doGet<Player[]>(url,[]);
    return of(beginnersMenu);
  }

  getSturies(offset : number, maxCount: number) {
    let url = environment.blogHost + this.FETCH_STUDIES;
    url=url+"?_limit="+maxCount+"&_sort=published_at:desc&_start="+offset
    return this.http.doGet<Study[]>(url,[]);
  }

  getStudy(slug :string) {
    let url = environment.blogHost + this.FETCH_STUDY;
    url = url.replace("{1}", slug)
    return this.http.doGet<Study>(url,[]);
  }

  getTopOpenings(count) {
    let openingsJson = localStorage.getItem("ecos")
    if(openingsJson && openingsJson.length > 0) {
      return of({
        body:JSON.parse(openingsJson)
      })
    }

    let url = environment.apiHost + this.FETCH_TOP_OPENINGS;
    url = url.replace("{1}", count)
    return this.http.doGet<ECO[]>(url, [])
  }

  getTopOpening(eco : string) {
    let url = environment.apiHost + this.FETCH_TOP_OPENING;
    url = url.replace("{1}", eco)
    return this.http.doGet<EcoModel[]>(url, [])
  }

  getTopOpeningById(id : string) {
    let url = environment.apiHost + this.FETCH_TOP_OPENING_BY_ID;
    url = url.replace("{1}", id)
    return this.http.doGet<EcoModel>(url, [])
  }

  getAllLinesOfOpening(eco : string) {
    let url = environment.apiHost + this.FETCH_TOP_OPENING_ALL_LINES;
    url = url.replace("{1}", eco)
    return this.http.doGet<EcoModel[]>(url, [])
  }

  searchPlayers(name : string) {
    let url = environment.apiHost + this.SEARCH_PLAYERS;
    url = url.replace("{1}", name)
    return this.http.doGet<Player[]>(url, [])
  }

  searchGames(params : GameSearchParams, page: number, count :number) {
    let url = environment.apiHost + this.SEARCH_GAMES;
    url = url.replace("{1}", page+"").replace("{2}", count+"")
    if(params.whitePlayer) {
      url = url + "&player1=" + params.whitePlayer
    }

    if(params.blackPlayer) {
      url = url + "&player2=" + params.blackPlayer
    }

    if(params.year) {
      url = url + "&year=" + params.year
    }

    if(params.tournament) {
      url = url + "&tournament=" + encodeURIComponent(params.tournament)
    }

    if(params.category) {
      url = url + "&endgame_type=" + params.category
    }

    if(params.sacrifice) {
      url = url + "&sacType=" + params.sacrifice
    }
    if(params.eco) {
      url = url + "&eco=" + params.eco
    }
    if(params.result) {
      url = url + "&result=" + params.result
    }
    return this.http.doGet<Game[]>(url, [])

  }

  searchGamesFromPosition(fen:string, page: number,count: number){
    let base64OfFen = btoa(fen);
    base64OfFen = encodeURI(base64OfFen);
    let url = environment.apiHost + this.SEARCH_GAMES_FROM_POSITION;
    url = url.replace("{1}", base64OfFen+"").replace("{2}", page+"").replace("{3}", count+"")
    return this.http.doGet<Game[]>(url,[])
  }

  fetchPage(slug : string) {
    let url = environment.blogHost + this.FETCH_PAGE;
    url = url.replace("{1}", slug);
    return this.http.doGet<Page>(url,[]);
  }

  fetchWeeklyChess(slug : string) {
    let url = environment.blogHost + this.FETCH_WEEKLY_CHESS;
    url = url.replace("{1}", slug);
    return this.http.doGet<Page>(url,[]);
  }

  fetchWeeklyChesses(offset : number, maxCount: number) {
    let url = environment.blogHost + this.FETCH_WEEKLY_CHESSES;
    url=url+"?_limit="+maxCount+"&_sort=published_at:desc&_start="+offset
    return this.http.doGet<Post[]>(url,[]);
  }

  getGameCollection(collectionId : string) {
    let url = environment.apiHost + this.FETCH_GAME_COLLECTION;
    url = url.replace("{1}", collectionId)
    return this.http.doGet<GameCollection>(url,[]);
  }

  getGameCollections(page : number, count : number) {
    let url = environment.apiHost + this.FETCH_GAME_COLLECTIONS;
    url = url.replace("{1}", page+"").replace("{2}", count+"")
    return this.http.doGet<GameCollection[]>(url,[]);
  }

  getGameCollectionsWithCategory(page : number, count : number, category: string) {
    let url = environment.apiHost + this.FETCH_GAME_COLLECTIONS_WITH_CATEGORY;
    url = url.replace("{1}", page+"").replace("{2}", count+"").replace("{3}", category+"")
    return this.http.doGet<GameCollection[]>(url,[]);
  }

  fetchAllGames(ids : string) {
    let url = environment.apiHost + this.FETCH_ALL_GAMES;
    url = url.replace("{1}", ids);
    return this.http.doGet<Game[]>(url,[])
  }

  parsePgn(pgn : string) {
    pgn = this.toBinary(pgn);
    let base64Pgn = btoa(pgn+" ");
    base64Pgn = encodeURI(base64Pgn);
    let url  = environment.apiHost + this.PARSE_PGN+ "?pgn="+base64Pgn;
    return this.http.doGet<Game[]>(url,[])
  }

  parseBulkPgn(pgn : string) {
    pgn = this.toBinary(pgn);
    let base64Pgn = btoa(pgn+" ");
    base64Pgn = encodeURI(base64Pgn);
    let url  = environment.apiHost + this.PARSE_PGN;
    return this.http.doPost<Game[]>(url,[], base64Pgn)
  }

  searchTournaments(term : string) {
    let url = environment.apiHost + this.SEARCH_TOURNAMENT;
    url = url.replace("{1}", term)
    return this.http.doGet<Tournament[]>(url,[]);
  }

  getOpeningForFen(fen : string) {
    let url = environment.apiHost + this.FETCH_OPENING_FOR_FEN;
    url = url.replace("{1}", fen)
    return this.http.doGet<string>(url,[]);
  }

  getOpeningForMoves(moves : string) {
    let url = environment.apiHost + this.FETCH_OPENING_FOR_MOVES;
    url = url.replace("{1}", moves)
    return this.http.doGet<string>(url,[]);
  }

  getMatchOnDate(date) {
    let url = environment.blogHost + this.FETCH_CALENDER_BY_DATE;
    url = url.replace("{1}", date)
    return this.http.doGet<Calender[]>(url,[]);
  }

  getMatchOfPlayer(playerName) {
    let todayDate = new Date().toLocaleString().split(",")[0].split("/").join("-");
    let url = environment.blogHost + this.FETCH_CALENDER_BY_PLAYER;
    url = url.replace("{1}", playerName).replace("{2}", playerName).replace("{3}", todayDate)
    return this.http.doGet<Calender[]>(url,[]);
  }

  getMatchOfTournament(tournamentId) {
    let url = environment.blogHost + this.FETCH_CALENDER_BY_TOURNAMENT;
    url = url.replace("{1}", tournamentId)
    return this.http.doGet<Calender[]>(url,[]);
  }

  searchOpening(term : string) {
    let url = environment.apiHost + this.SEARCH_OPENING;
    url = url.replace("{1}", term)
    return this.http.doGet<EcoModel[]>(url,[]);
  }

  fetchTodaysPuzzle() {
    let url = environment.apiHost + this.FETCH_TODAY_PUZZLE;
    return this.http.doGet<Puzzle>(url,[]);
  }

  fetchPuzzleOfTheDay(date : string) {
    let url = environment.apiHost + this.FETCH_PUZZLE_ON_THE_DAY;
    url = url.replace("{1}", date)
    return this.http.doGet<Puzzle>(url,[]);
  }

  fetchWeeklyPgn() {
    let url = environment.apiHost + this.FETCH_WEEKS_PGN;
    return this.http.doGet<string[]>(url,[]);
  }

  fetchWeeklyGames(page, count) {
    let url = environment.apiHost + this.FETCH_WEEKS_GAMES;
    url = url.replace("{1}", page)
    url = url.replace("{2}", count)
    return this.http.doGet<Game[]>(url,[]);
  }

  searchPuzzlesByIds(ids : string[]) {
    let idArr = "";
    ids.forEach(i=> {
      idArr = idArr + "," + i;
    })
    idArr = idArr.substring(1);
    let base64OfIdArr = btoa(idArr);
    base64OfIdArr = encodeURI(base64OfIdArr);
    let url = environment.apiHost + this.SEARCH_PUZZLES_BULK;
    url = url.replace("{1}", base64OfIdArr);
    return this.http.doGet<Puzzle[]>(url,[]);
  }

  searchBlindfoldPuzzles(rating, page, count) {
    let url = environment.apiHost + this.SEARCH_BLINDFOLD_PUZZLES;
    url = url.replace("{1}", rating).replace("{2}", page).replace("{3}", count)
    return this.http.doGet<Puzzle[]>(url, []);
  }

  searchPuzzles(opening, theme, pieces, rating, page, count) {
    let url = environment.apiHost + this.SEARCH_PUZZLES;
    let queryParam = "";
    if(rating > 0) {
      queryParam = "rating="+rating
    }

    if(opening && opening.trim().length > 0) {
      if(queryParam.trim().length > 0)
        queryParam = queryParam+"&opening="+opening
      else
        queryParam = "opening="+opening
    }

    if(theme && theme.trim().length > 0) {
      if(queryParam.trim().length > 0)
        queryParam = queryParam+"&theme="+theme
      else
        queryParam = "theme="+theme
    }

    if(pieces && pieces.trim().length > 0) {
      if(queryParam.trim().length > 0)
        queryParam = queryParam+"&pieces="+pieces
      else
        queryParam = "pieces="+pieces
    }
    if(page >-1) {
      if(queryParam.trim().length > 0)
        queryParam = queryParam+"&page="+page
      else
        queryParam = "page="+page
    }

    if(count >-1) {
      if(queryParam.trim().length > 0)
        queryParam = queryParam+"&count="+count
      else
        queryParam = "count="+count
    }
    if(queryParam.trim().length > 0)
      queryParam = "?"+queryParam;

    url = url + queryParam;
    return this.http.doGet<Puzzle[]>(url,[]);
  }

  fetchMovesFromWeeklyGames(fen) {
    let base64OfFen = btoa(fen);
    base64OfFen = encodeURI(base64OfFen);
    let path = environment.apiHost + this.FETCH_MOVES_FROM_POSITION_FROMWEEKLY_GAME.replace("{1}", base64OfFen);
    return this.http.doGet<any[]>(path, null);
  }

  fetchChessComGamesMetaData(username) {
    let url = this.FETCH_CHESS_COM_GAMES_METADATA.replace("{1}", username);
    return this.http.doGet<any>(url, []);
  }

  submitFeedback(feedback) {
    let url = environment.blogHost + this.SUBMIT_FEEDBACK;
    return this.http.doPost<Feedback>(url, [], feedback);
  }

  submitComent(comment) {
    let url = environment.blogHost + this.SUBMIT_COMMENT;
    return this.http.doPost<Comment>(url, [], comment);
  }

  fetchComents(type, slug) {
    let url = environment.blogHost + this.SUBMIT_COMMENT.replace("{1}", type).replace("{2}", slug);
    return this.http.doGet<Comment[]>(url, []);
  }

  toBinary(str)
  {
      let result="";

      str=encodeURIComponent(str);

      for(let i=0;i<str.length;i++)
          if(str[i]=="%")
          {
              result+=String.fromCharCode(parseInt(str.substring(i+1,i+3),16));
              i+=2;
          }
          else
              result+=str[i];

      return result;
  }

  updatePuzzleEval(puzzle) {
    let token = md5(puzzle.fen + ":" + puzzle.eval);
    let url = environment.apiHost + this.UPDATE_PUZZLE_EVAL;
    url = url.replace("{1}", token);
    return this.http.doPut(url, [], puzzle);
  }

  fetchEndGames(page : number) {
    let url = environment.apiHost + this.FETCH_ENDGAME;
    url = url.replace("{1}", page+"")
    return this.http.doGet<Endgame[]>(url, []);
  }

  searchEndGames(page : number, pieces : string, player : string ) {
    let url = environment.apiHost + this.SEARCH_ENDGAME;
    url = url.replace("{1}", page+"")
    if(pieces && pieces.trim().length > 0) {
      url = url + "&pieces=" + pieces
    }
    if(player && player.trim().length > 0) {
      url = url + "&player=" + player
    }
    return this.http.doGet<Endgame[]>(url, []);
  }

  downloadParsedCHessDotComGames(year, month, username) {
    let url = environment.apiHost + this.DOWNLOAD_PARSED_CHESS_COM_GAMES;
    url = url.replace("{1}", year)
    url = url.replace("{2}", month)
    url = url.replace("{3}", username)
    return this.http.doGet<Game[]>(url, []);
  }

  fetchAllEcos(count) {
    let openingsJson = localStorage.getItem("ecos-all")
    if(openingsJson && openingsJson.length > 0) {
      return of({
        body:JSON.parse(openingsJson)
      })
    }
    let url = environment.apiHost + this.FETCH_ALL_OPENINGS;
    url = url.replace("{1}", count)
    return this.http.doGet<EcoModel[]>(url, []);
  }

  recordAnalytics(route) {
    let sessionStr = localStorage.getItem("sessionObj")
    let analyticsData = null;
    analyticsData = {
      "route" : route
    }
    if(sessionStr) {
      let sessionObj = JSON.parse(sessionStr)
      if(sessionObj["uid"]) {
        analyticsData["uid"] = sessionObj["uid"]
      }

      if(sessionObj["sessionId"]) {
        analyticsData["sessionId"] = sessionObj["sessionId"]
      }
    }
    let url = environment.apiHost + this.RECORD_ANALYTICS;
    this.http.doPost(url,[], analyticsData).subscribe(res=> {
      if(res) {
        let analyuticsData = res.body
        localStorage.setItem("sessionObj", JSON.stringify(analyuticsData))
      }
    })
  }

  downloadLichessGames(username : string, format : string) {
    let url = environment.apiHost + this.DOWNLOAD_PARSED_LICHESS_GAMES;
    url = url.replace("{1}", username)
    if(format && format.trim().length > 0) {
      url = (url + "&formats=" + format);
    }
    return this.http.doGet<Game[]>(url, []);
  }

  signUp(user) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.SIGN_UP;
    return this.http.doPost<User>(url, headers, user);
  }

  checkUserName(username) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.CHECK_USERNAME;
    url = url.replace("{1}", username)
    return this.http.doGet<User>(url, headers);
  }

  checkEmail(email) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.CHECK_EMAIL;
    url = url.replace("{1}", email)
    return this.http.doGet<User>(url, headers);
  }

  signIn(username , password) {
    let tokenTime = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + tokenTime
    let hash = md5(hashingToken)
    let token = username + ":" + password;
    token = btoa(token);
    token = "Basic " + token;
    let headers = {
      "Authorization" : token,
      "X_REQUEST_TOKEN" : tokenTime,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.SIGN_IN
    return this.http.doPost<Auth>(url, headers,"");
  }

  requestPasswordResetToken(username) {
    let token = new Date().getTime() + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.REQUEST_PASSWORD_RESET_TOKEN;
    url = url.replace("{1}", username);
    return this.http.doGet(url, headers);
  }

  updatePassword(username, passwordResetToken, password) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.UPDATE_PASSWORD;
    url = url.replace("{1}", username).replace("{2}", passwordResetToken).replace("{3}", password);
    return this.http.doPut(url, headers, "");
  }

  createTraining(userId, training) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.CREATE_TRAINING;
    url = url.replace("{1}", userId);
    return this.http.doPost(url, headers, training)
  }

  updateTraining(userId, training) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.UPDATE_TRAINING;
    url = url.replace("{1}", userId);
    return this.http.doPut<TrainingReport>(url, headers, training)
  }

  deleteTraining(trainingId) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.DELETE_TRAINING;
    url = url.replace("{1}", trainingId);
    return this.http.doDelete(url, headers)
  }

  updateActiveTraining() {
    let userStr = localStorage.getItem("auth.user")
    if(userStr) {
      let user = JSON.parse(userStr)
      let reportStr = localStorage.getItem("trainingReport")
      if(reportStr) {
        let report =  JSON.parse(reportStr)
        return this.updateTraining(user.id, report);
      }
    }
  }

  getActiveTraining(userId) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.ACTIVE_TRAINING;
    url = url.replace("{1}", userId);
    return this.http.doGet<TrainingReport>(url, headers);
  }

  saveGameInsight(summary, userId) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.SAVE_GAME_INSIGHT;
    url = url.replace("{1}", userId);
    return this.http.doPost<BulkAnalyzerSummary>(url, headers, summary);
  }

  fetchGameInsights(userId) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.FETCH_GAME_INSIGHTS;
    url = url.replace("{1}", userId);
    return this.http.doGet<BulkAnalyzerSummary[]>(url, headers);
  }

  fetchGameInsight(insightId) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.FETCH_GAME_INSIGHT;
    url = url.replace("{1}", insightId);
    return this.http.doGet<BulkAnalyzerSummary>(url, headers);
  }

  deleteGameInsight(insightId) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.FETCH_GAME_INSIGHT;
    url = url.replace("{1}", insightId);
    return this.http.doDelete(url, headers);
  }

  updateUserPref(userId, pref) {
    let token = new Date().getTime()  + "";
    let hashingToken = environment.paddingString + token
    let hash = md5(hashingToken)
    let headers = {
      "X_REQUEST_TOKEN" : token,
      "X_REQUEST_HASH" : hash
    }
    let url = environment.apiHost + this.UPDATE_PREF;
    return this.http.doPatch(url, headers, pref)
  }

}
