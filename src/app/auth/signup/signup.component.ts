import { UiService } from './../../shared/ui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  maxDate: Date | undefined;
  //isLoading = false;
  isLoading$?: Observable<boolean>;
  //private loadingSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  /*ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }*/

  onSubmit(form: NgForm) {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    /*this.loadingSubscription = this.uiService.loadingStateChange.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );*/

    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }
}
