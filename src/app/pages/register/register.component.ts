import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChessBoardComponent } from 'src/app/common/chess-board/chess-board.component';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name : string
  username : string
  email : string
  lichessUsername  : string
  chessComUsername : string
  otherPlatform : string
  puzzleSolved : boolean = false;
  newsLetterSubscribbed : boolean = true;
  password : string
  error : string
  success : boolean
  usernameExists : boolean
  emailExists : boolean
  constructor(private snackbar : MatSnackBar, private service : ScriptChessServiceService) { }

  ngOnInit(): void {

  }

  signUp() {
    if(!this.name || this.name.trim().length  == 0) {
      this.snackbar.open("Please enter your name", "close")
      return
    }

    if(!this.username || this.username.trim().length  == 0) {
      this.snackbar.open("Please enter your username", "close")
      return
    }

    if(!this.email || this.email.trim().length  == 0) {
      this.snackbar.open("Please enter your email", "close")
      return
    }
    if(!this.puzzleSolved) {
      this.snackbar.open("Please complete the puzzle", "close")
      return
    }

    if(!this.password || this.password.trim().length  == 0) {
      this.snackbar.open("Please Enter the password", "close")
      return
    }
    if(this.usernameExists) {
      this.snackbar.open("Username: " + this.username + " is not available", "close")
      return
    }

    if(this.emailExists) {
      this.snackbar.open("Email: " + this.email + " is already registered", "close")
      return
    }
    let user = {
      name : this.name,
      email : this.email,
      userName : this.username,
      chessComUsername : this.chessComUsername,
      lichessUsername : this.lichessUsername,
      otherPlatform : this.otherPlatform,
      newsLetterSubscribed : this.newsLetterSubscribbed,
      password : this.password
    }
    this.service.signUp(user).subscribe(res=> {
      if(res.status == 201) {
        this.success = true;
        this.error = null;
      }
    }, err=> {
      this.error = err.message;
      this.success = false;
    })
  }

  captcha(move, board : ChessBoardComponent) {
    if(move.move.san.indexOf("#") < 0) {
      if(board) {
        board.undoMove()
        this.snackbar.open("That's not the move", "Try Again")
      }
    } else {
      this.puzzleSolved = true;
    }
  }

  checkUsername() {
    this.service.checkUserName(this.username).subscribe(res=> {
      if(res.status == 200) {
        this.usernameExists = true;
      }
    }, err=> {
      if(err.status == 404) {
        this.usernameExists = false;
      }
    })
  }

  checkEmail() {
    this.service.checkEmail(this.email).subscribe(res=> {
      if(res.status == 200) {
        this.emailExists = true;
      }
    }, err=> {
      if(err.status == 404) {
        this.emailExists = false;
      }
    })
  }
}
