import {Component, ViewChild, OnInit} from '@angular/core';
import {AuthService} from './auth/auth.service';
import {Store} from '@ngrx/store';
import * as fromRoot from './app.reducer';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  openSidenav = false;
  @ViewChild('sidenav') sidenav;

  constructor(private authService: AuthService, private store: Store<fromRoot.State>) {

  }

  ngOnInit() {
    this.authService.initAuthListener();
    this.store.select(fromRoot.getIsSidenav).subscribe(opened => {
      if (opened) {
        this.sidenav.open();
      } else {
        this.sidenav.close();
      }
    });
  }

}
