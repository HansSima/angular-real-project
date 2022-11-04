import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { Exercise } from './exercise.model';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise?: Exercise | null;
  private exerciseCollection!: AngularFirestoreCollection<Exercise>;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

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
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        })
    );
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }
  }

  completeExercise() {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        date: new Date(),
        state: 'completed',
      });
    }
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    if (this.runningExercise) {
      this.addDataToDatabase({
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'canceled',
      });
    }
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCanceledExercises() {
    this.exerciseCollection = this.db.collection<Exercise>('finishedExercises');
    this.fbSubs.push(
      this.exerciseCollection
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          console.log(exercises);
          this.finishedExercisesChanged.next(exercises);
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
