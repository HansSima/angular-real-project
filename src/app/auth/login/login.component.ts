import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading$?: Observable<boolean>;
  //private loadingSubscription!: Subscription;
  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  ngOnInit() {}

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
    this.authService.login({
      email: form.value.email,
      password: form.value.password,
    });
  }
}
