import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  username : string
  password : string
  error : boolean = false;
  processing = false;

  constructor(private service : ScriptChessServiceService, private router : Router) { }

  ngOnInit(): void {
  }

  login() {
    this.processing = true;
    this.service.signIn(this.username, this.password).subscribe(res=> {
      this.processing = false;
      if(res.status == 200) {
        let token = res.body.token;
        let userClaims = atob(token.split('.')[1])
        localStorage.setItem("auth", res.body.token);
        localStorage.setItem("auth.user", userClaims);
        let claims = JSON.parse(userClaims)
        if(claims["darkSquareColor"])
          localStorage.setItem("darkSquareColor", claims["darkSquareColor"])
        if(claims["pieceTheme"])
          localStorage.setItem("pieceTheme", claims["pieceTheme"])
        window.location.href = "/"
      }
    }, err =>{
      this.error = true;
      this.processing = false;
    })
  }

  signUp() {
    this.router.navigateByUrl("/register")
  }

}
