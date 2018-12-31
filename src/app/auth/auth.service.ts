import {AuthData} from './AuthData';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {TrainingService} from '../training/training.service';
import {MatSnackBar} from '@angular/material';
import {UiService} from '../shared/ui.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from '../auth/auth.actions';

@Injectable()
export class AuthService {
  constructor(public router: Router, private afAuth: AngularFireAuth,
              private trainingService: TrainingService,
              public snackbar: MatSnackBar,
              public uiService: UiService,
              private store: Store<fromRoot.State>) {
  }

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new Auth.SetAuthenticated());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubs();
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
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
}
