import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrainingComponent} from './training.component';
import {CurrentTrainingComponent} from './current-training/current-training.component';
import {NewTraningComponent} from './new-traning/new-traning.component';
import {PastTraningsComponent} from './past-tranings/past-tranings.component';
import {StopTrainingComponent} from './current-training/stop-training.component';
import {SharedModule} from '../shared/shared.module';
import {TrainingRoutingModule} from './training-routing.module';
import {StoreModule} from '@ngrx/store';
import {trainingReducer} from './training.reducer';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTraningComponent,
    PastTraningsComponent,
    StopTrainingComponent
  ],
  imports: [
    CommonModule,
    SharedModule, TrainingRoutingModule,
    StoreModule.forFeature('training', trainingReducer)
  ],
  entryComponents: [StopTrainingComponent]
})
export class TrainingModule { }
