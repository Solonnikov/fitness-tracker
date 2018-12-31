import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app.reducer';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter<void>();
  isAuth$: Observable<boolean>;

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }

  onClose() {
    this.sidenavClose.emit();
  }

  onLogout() {
    this.authService.logout();
  }
}
