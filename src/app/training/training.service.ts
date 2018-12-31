import {Injectable} from '@angular/core';
import {Exercise} from './exercise.model';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {UiService} from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import {Store} from '@ngrx/store';
import {take} from 'rxjs/operators';

@Injectable()
export class TrainingService {

  private fbSubs: Subscription[] = [];

  constructor(public db: AngularFirestore, public uiService: UiService, private store: Store<fromTraining.State>) {
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
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        },
        err => {
          this.store.dispatch(new UI.StopLoading());
          this.uiService.showSnackbar('Fetching exercises failed, please try again later', null, 3000);
        }));
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));

  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });

  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedExercises() {
    this.uiService.loginStateChanged.next(true);
    this.fbSubs.push(
      this.db.collection('finishedExercises').valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.uiService.loginStateChanged.next(false);
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));

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
