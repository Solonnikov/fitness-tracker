import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import {Store} from '@ngrx/store';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-past-tranings',
  templateUrl: './past-tranings.component.html',
  styleUrls: ['./past-tranings.component.css']
})
export class PastTraningsComponent implements OnInit, AfterViewInit {
  displayedColumns: Array<string>;
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public trainingService: TrainingService, private store: Store<fromTraining.State>) {
    this.displayedColumns = [
      'date', 'name', 'duration', 'calories', 'state'
    ];
  }

  ngOnInit() {
    this.store.select(fromTraining.getFinishedExercises).subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    });
    this.trainingService.fetchCompletedExercises();
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(value: string) {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
}
