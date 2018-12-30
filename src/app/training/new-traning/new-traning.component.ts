import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from '../training.service';
import {Exercise} from '../exercise.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {UiService} from '../../shared/ui.service';
import {Observable} from 'rxjs/Observable';

import * as fromRoot from '../../app.reducer';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-new-traning',
  templateUrl: './new-traning.component.html',
  styleUrls: ['./new-traning.component.css']
})
export class NewTraningComponent implements OnInit {
  exercises: Exercise[];
  exerciseSubscription: Subscription;
  isLoading: Observable<boolean>;


  constructor(public trainingService: TrainingService, public uiService: UiService, private store: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.isLoading = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      if (!exercises) {

      } else {
        this.exercises = exercises;
      }
    });
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
