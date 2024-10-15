import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-google-sign-in',
  templateUrl: './google-sign-in.component.html',
  styleUrls: ['./google-sign-in.component.scss']
})
export class GoogleSignInComponent implements OnInit {

  redirectUrl  = ""
  registerUrl  = ""
  constructor() { }

  ngOnInit(): void {
    this.registerUrl = environment.userRegistrationUrl
    this.redirectUrl = environment.googleRedirectUrl
  }

  onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

  }

}
