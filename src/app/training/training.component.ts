import { TrainingService } from './training.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  exercisesSubscription?: Subscription;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exercisesSubscription = this.trainingService.exerciseChanged.subscribe(
      (ex) => {
        if (ex) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }
  }
}
