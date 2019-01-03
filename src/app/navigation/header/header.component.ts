import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../auth/auth.service';
import * as Sidenav from '../../shared/sidenav.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private store: Store<fromRoot.State>, public  authService: AuthService) {
  }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  ontoggleSidenav() {
    this.store.dispatch(new Sidenav.ToggleSidenav());
    // this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
