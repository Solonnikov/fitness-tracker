import {User} from './User';
import {AuthData} from './AuthData';
import {Subject} from 'rxjs/Subject';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {MatSnackBar} from '@angular/material';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class AuthService {
  private isAuthenticated = false;
  authChanges = new Subject<boolean>();

  constructor(public router: Router, private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              public snackbar: MatSnackBar,
              public uiService: UiService,
              private store: Store<fromRoot.State>) {

  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChanges.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubs();
        this.authChanges.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.store.dispatch(new UI.StopLoading());
      this.router.navigate(['/training']);
    })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());

        this.uiService.showSnackbar(err.message, null, 3000);
      });
    this.authChanges.next(true);
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      this.store.dispatch(new UI.StopLoading());

      this.router.navigate(['/training']);
    })
      .catch(err => {
        this.store.dispatch(new UI.StopLoading());

        this.uiService.showSnackbar(err.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
