import { UiService } from './../shared/ui.service';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { map, Subject, Subscription, take } from 'rxjs';
import { Exercise } from './exercise.model';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[] | null>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise | null;
  private exerciseCollection!: AngularFirestoreCollection<Exercise>;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.exerciseCollection =
      this.db.collection<Exercise>('availableExercises');
    this.fbSubs.push(
      this.exerciseCollection
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data().name,
                duration: doc.payload.doc.data().duration,
                calories: doc.payload.doc.data().calories,
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            //this.uiService.loadingStateChange.next(false);
            //this.availableExercises = exercises;
            //this.exercisesChanged.next([...this.availableExercises]);
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          (error) => {
            this.uiService.showSnackbar(
              'Fetching Exercises failed please try it later',
              undefined,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
    /*this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }*/
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: 'completed',
        });
        this.store.dispatch(new Training.StopTraining());
      });

    //this.runningExercise = null;
    //this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          duration: ex.duration * (progress / 100),
          calories: ex.calories * (progress / 100),
          date: new Date(),
          state: 'canceled',
        });
        this.store.dispatch(new Training.StopTraining());
      });

    /*if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'canceled',
      });
    }
    //this.runningExercise = null;
    //this.exerciseChanged.next(null);
    this.store.dispatch(new Training.StopTraining());*/
  }

  /*getRunningExercise() {
    return { ...this.runningExercise };
  }*/

  fetchCompletedOrCanceledExercises() {
    this.exerciseCollection = this.db.collection<Exercise>('finishedExercises');
    this.fbSubs.push(
      this.exerciseCollection
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
          //this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  cancelSubsription() {
    this.fbSubs.forEach((subs) => subs.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
