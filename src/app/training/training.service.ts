import {Injectable} from '@angular/core';
import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {UiService} from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import {Store} from '@ngrx/store';

@Injectable()
export class TrainingService {
  availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, calories: 8}
  ];


  private runningExercise: Exercise;
  private exercises: Exercise[] = [];
  public exerciseChanged = new Subject<Exercise>();
  public exercisesChanged = new Subject<Exercise[]>();
  public finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];
  finishedExercises: Exercise[] = [];

  constructor(public db: AngularFirestore, public uiService: UiService, private store: Store<fromRoot.State>) {
  }

  getAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new UI.StopLoading());
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },
        err => {
          this.exercisesChanged.next(null);
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
        }));
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId)
    //   .update({
    //     lastSelected: new Date()
    //   });
    this.runningExercise = this.availableExercises.find(el => el.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercises() {
    return {...this.runningExercise};
  }

  fetchCompletedExercises() {
    this.uiService.loginStateChanged.next(true);
    this.fbSubs.push(
      this.db.collection('finishedExercises').valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.uiService.loginStateChanged.next(false);
          this.finishedExercisesChanged.next(exercises);
        }, err => {
          this.uiService.showSnackbar('Fetching Exercises Failed, lease try again later', null, 3000);
        }));
  }

  cancelSubs() {
    this.fbSubs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  private addDataToDatabase(exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

}
