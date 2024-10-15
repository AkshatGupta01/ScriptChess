import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AnalysisStorageSchema, GameStorageSchema, PositionAnalysisStorageSchema } from '../models/storage-models';
import { DatePipe } from '../pipes/date.pipe';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  gameTable = "games"
  analysisTable = "analysis"
  positionAnalysisTable = "positionAnalysis"
  weeksGamePositionTable = "weeksGamePosition"
  constructor(private dbService: NgxIndexedDBService) { }

  addGame(game : GameStorageSchema) {
    if(game && game.pgn && game.pgn.trim().length > 0) {
      return this.dbService.add<GameStorageSchema>(this.gameTable, game)
    }
    return null;      
  }

  addPositionAnlysis(position : PositionAnalysisStorageSchema) {
    if(position && position.fen && position.eval && position.eval.trim().length > 0) {
      return this.dbService.add<PositionAnalysisStorageSchema>(this.positionAnalysisTable, position)
    }
    return null;      
  }

  getPositionAnlysis(fen : string) {
    if(fen && fen.trim().length > 0) {
      return this.dbService.getByIndex<PositionAnalysisStorageSchema>(this.positionAnalysisTable, "fen", fen)
    }
    return null;      
  }

  deleteGame(key) {
    return this.dbService.deleteByKey(this.gameTable, key)
  }

  getGame(key) {
    return this.dbService.getByKey<GameStorageSchema>(this.gameTable, key)
  }

  getAllGames() {
    return this.dbService.getAll<GameStorageSchema>(this.gameTable)
  }

  addAnalysis(analysis : AnalysisStorageSchema) {
    if(analysis && analysis.pgn && analysis.pgn.trim().length > 0 && analysis.moves && analysis.moves.length > 0) {
      return this.dbService.add<AnalysisStorageSchema>(this.analysisTable, analysis)
    }
    return null;   
  }

  deleteAnalysis(key) {
    return this.dbService.deleteByKey(this.analysisTable, key)  
  }

  getAnalysis(key) {
    return this.dbService.getByKey<AnalysisStorageSchema>(this.analysisTable, key)      
  }

  getAllAnalysis() {
    return this.dbService.getAll<AnalysisStorageSchema>(this.analysisTable)
  }

  savePosition(fenMoveMap) {
    let firstDayOfWeek = this.getFirstDayOfWeek(new Date());
    let dateString = new DatePipe().transform(firstDayOfWeek.toString());
    fenMoveMap["date"] = dateString;
    this.dbService.add(this.weeksGamePositionTable, fenMoveMap);
  }

  getWeeksGamePosition() {
    return this.dbService.getAll(this.weeksGamePositionTable);
  }

  getFirstDayOfWeek(d) {
    // 👇️ clone date object, so we don't mutate it
    const date = new Date(d);
    const day = date.getDay(); // 👉️ get day of week
  
    // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  
    return new Date(date.setDate(diff));
  }
}
