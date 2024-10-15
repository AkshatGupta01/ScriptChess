import { Component, OnInit } from '@angular/core';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-customize-board',
  templateUrl: './customize-board.component.html',
  styleUrls: ['./customize-board.component.scss']
})
export class CustomizeBoardComponent implements OnInit {
  selected : string
  selectedPieceTheme : string
  choosen = 'selected'
  boardArray = ["gray", "sky", "orange"]
  boardArrayMap = {
    "gray":"#8CA2AD",
    "orange":"#BB5746",
    "sky":"#018795"
  }

  radiusSet = ["0px", "2px", "5px"]
  highlightTheme = ["subtle", "super-light", "super-dark"]
  radiusmap =  {
    "0px" : "No",
    "2px" : "Small",
    "5px" : "Large",
  }

  pieceThemes: string[] = ["alpha", "california", "cburnett", "chess7", "chessnut", "chicago", "companion",
  "dark-sc", "fantasy", "iowa", "kosal", "leipzig", "letter", "merida", "mono", "oslo", "pirouetti",
  "pixel", "reilly", "riohacha", "scriptchess", "shapes", "spatial", "symmetric","test"]
  squareRadius = "0px";



  constructor(private service : ScriptChessServiceService) {
    let color = localStorage.getItem("darkSquareColor")
    this.squareRadius = localStorage.getItem("squareRadius")
    this.selectedPieceTheme = localStorage.getItem("pieceTheme")
    if(!this.squareRadius) {
      this.squareRadius = "0px";
    }
    if(color) {
      switch(color) {
        case '#8CA2AD':
          this.selected = 'gray'
          break
        case '#BB5746':
          this.selected = 'orange'
          break
        case '#018795':
          this.selected = 'sky'
          break
      }
    }
  }

  ngOnInit(): void {
  }

  selectTheme(color) {
    localStorage.setItem("darkSquareColor", color)
    document.documentElement.style.setProperty('--darkSquareColor', color);
    switch(color) {
      case '#8CA2AD':
        this.selected = 'gray'
        break
      case '#BB5746':
        this.selected = 'orange'
        break
      case '#018795':
        this.selected = 'sky'
        break
    }
    let pref = {
      darkSquareColor : color
    }
    let userStr = localStorage.getItem("auth.user");
    if(userStr) {
      let user = JSON.parse(userStr)
      this.service.updateUserPref(user.id, pref).subscribe(res=>{})
    }

  }

  setPieceTheme(theme) {
    localStorage.setItem("pieceTheme", theme)
    this.selectedPieceTheme = theme;
    let pref = {
      pieceTheme : theme
    }
    let userStr = localStorage.getItem("auth.user");
    if(userStr) {
      let user = JSON.parse(userStr)
      this.service.updateUserPref(user.id, pref).subscribe(res=>{})
    }
  }

  selectRadius(radius) {
    document.documentElement.style.setProperty('--squareRadius', radius);
    localStorage.setItem("squareRadius", radius)
    this.squareRadius = radius
  }

  selectHighlightSquares(theme) {
    localStorage.setItem("hightlight-theme", theme)
  }
}
