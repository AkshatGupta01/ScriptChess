import { Component, OnInit } from '@angular/core';
import { posts } from 'src/app/static-data/posts';
import { menuItems } from 'src/app/static-data/special-menu';
import {staticGames} from 'src/app/static-data/game';
import * as ChessJS from 'src/app/util/chessjs/chess';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
import { analyzeWeakness, analyzeWeaknessEx, testExtendedFunctionalities } from 'src/app/util/fen-validator';
import { Weakness } from 'src/app/models/weaknesses';
import { getCoverageMatrix } from 'src/app/util/chessjsutil';
@Component({
  selector: 'app-play-ground',
  templateUrl: './play-ground.component.html',
  styleUrls: ['./play-ground.component.scss']
})
export class PlayGroundComponent implements OnInit {

  specialMenuItems = menuItems
  blogPosts = posts
  games = staticGames
  gamesTitle = "Games by Anand"

  Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;
  foundMoves : ChessJS.Move[] | ChessJS.InternalMove[]= []
  chess = new this.Chess();
  moves : string[] = [];
  boardFen : string = null
  problems= "";
  constructor() { }

  ngOnInit(): void {
  }

  findMoves(squareInput) {
    let info = squareInput.value.split(",");
    this.foundMoves = this.chess.getSupportedSquares({
      legal : true,
      square : info[0],
      color : info[1]

    })
    this.moves=  []
    this.moves.push("supported")
    this.foundMoves.forEach(m=> {
      this.moves.push(m.to);
    })

    this.foundMoves = this.chess.getAttackedSquares({
      legal : true,
      square : info[0],
      color : info[1]
    })
    this.moves.push("attacked")
    this.foundMoves.forEach(m=> {
      let to = m.to;
      if(this.moves.indexOf(to) < 0) {
        this.moves.push(to)
      }
    })
  }

  loadAnalysis(board : ChessBoardComponent) {
    let weaknesses = analyzeWeaknessEx(this.boardFen, board.getPosition())
    this.problems = JSON.stringify(weaknesses);
  }

  loadFen(fen, board : ChessBoardComponent) {
    this.boardFen = fen.value;
    board.loadFen(this.boardFen)
  }

  findExtendedFeatures(square) {
    let chess = new ChessJS.Chess(this.boardFen);
    this.problems = JSON.stringify(getCoverageMatrix(chess, this.boardFen))
  }

}
