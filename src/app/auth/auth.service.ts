import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
