import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Endgame } from 'src/app/models/endgame';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { AnalyticsService } from 'src/app/services/analytics.service';
@Component({
  selector: 'app-endgame-component-box',
  templateUrl: './endgame-component-box.component.html',
  styleUrls: ['./endgame-component-box.component.scss']
})
export class EndgameComponentBoxComponent implements OnInit {

  @Input()
  endgame : Endgame

  @Input()
  boardWidth : string

  @Input()
  mobile : boolean = false
  boardId : string
  turn : string
  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  chess = new this.Chess();

  constructor(private router : Router, private analytics : AnalyticsService) { }

  ngOnInit(): void {
    this.boardId = this.mobile ? this.endgame.gameId + "-mobile" : this.endgame.gameId
    this.chess = new this.Chess(this.endgame.fen);
    this.turn = this.chess.turn();
  }

  playAgainstEngine() {
    this.analytics.recordEndgamePlayWithBot()
    let base64Fen = btoa(this.endgame.fen)
    this.router.navigate(["play-against-chess-bots"],{queryParams: {"fen":base64Fen}})
  }

  analyzeFurther() {
    this.analytics.recordEndgameAnalysis()
    let base64Fen = btoa(this.endgame.fen)
    this.router.navigate(["free-chess-engine"],{queryParams: {"fen":base64Fen}})
  }

  checkFullGame() {
    this.analytics.recordEndgameGameView()
    this.router.navigate(["/tools/games/" + this.endgame.gameId + "/" + this.endgame.whitePlayer.name + "_vs_" + this.endgame.blackPlayer.name])
  }
}
