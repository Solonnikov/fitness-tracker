import {Action} from '@ngrx/store';

export const OPEN_SIDENAV = '[Sidenav] Open Sidenav';
export const CLOSE_SIDENAV = '[Sidenav] Close Sidenav';
export const TOGGLE_SIDENAV = '[Sidenav] Toggle Sidenav';


export class OpenSidenav implements Action {
  readonly type = OPEN_SIDENAV;
}

export class CloseSidenav implements Action {
  readonly type = CLOSE_SIDENAV;
}

export class ToggleSidenav implements Action {
  readonly type = TOGGLE_SIDENAV;
}

export type SidenavActions = OpenSidenav | CloseSidenav | ToggleSidenav;

