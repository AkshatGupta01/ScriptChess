import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScriptChessServiceService } from 'src/app/services/script-chess-service.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  username : string
  emailSent = false;
  sendingEmail = false;
  secret : string
  password : string
  cPassword : string
  updatingPassword = false;
  passwordResetCompleted = false;
  constructor(private service : ScriptChessServiceService, private snackbar : MatSnackBar) { }

  ngOnInit(): void {
  }

  startRecovery() {
    if(this.username) {
      this.sendingEmail = true;
      this.service.requestPasswordResetToken(this.username).subscribe(res=> {
        if(res.status == 200){
          this.emailSent = true;
          this.sendingEmail = false;
        }
      }, err=> {
        this.emailSent = false;
        this.sendingEmail = false;
        this.snackbar.open("There was some error, Please try later", "close")
      })
    } else {
      this.snackbar.open("Please enter your username", "close")
    }

  }

  resetPassword() {
    if(this.cPassword && this.password && this.password == this.cPassword) {
      if(this.secret) {
        this.updatingPassword = true;
        this.service.updatePassword(this.username, this.secret, this.password).subscribe(res=> {
          this.updatingPassword = false;
          if(res.status == 200) {
            this.passwordResetCompleted = true;
          }
        }, err=> {
          this.updatingPassword = false;
          this.passwordResetCompleted = false;
          this.snackbar.open("There was some error. " + err.message, "close")
        })

      }
    } else {
      this.snackbar.open("Passwords are not matching");
    }

  }

}
