import {Component, OnInit, ViewChild, AfterViewInit, OnDestroy} from '@angular/core';
import {MatTableDataSource, MatSort, MatPaginator} from '@angular/material';
import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-past-tranings',
  templateUrl: './past-tranings.component.html',
  styleUrls: ['./past-tranings.component.css']
})
export class PastTraningsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: Array<string>;
  dataSource = new MatTableDataSource<Exercise>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private exchangedSubscription: Subscription;

  constructor(public trainingService: TrainingService) {
    this.displayedColumns = [
      'date', 'name', 'duration', 'calories', 'state'
    ];
  }

  ngOnInit() {
    this.exchangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
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

  ngOnDestroy() {
    this.exchangedSubscription.unsubscribe();
  }

}
