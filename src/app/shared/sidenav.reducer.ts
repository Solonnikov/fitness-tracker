import {SidenavActions, OPEN_SIDENAV, CLOSE_SIDENAV, TOGGLE_SIDENAV} from './sidenav.actions';

export interface State {
  opened: boolean;
}

const initialState: State = {
  opened: false
};

export function sidenavReducer(state = initialState, action: SidenavActions) {
  switch (action.type) {
    case OPEN_SIDENAV:
      return {
        opened: true
      };
    case CLOSE_SIDENAV:
      return {
        opened: false
      };
    case TOGGLE_SIDENAV:
      return {
        opened: !state.opened
      };
    default: {
      return state;
    }
  }
}

export const getIsSidenav = (state: State) => state.opened;


