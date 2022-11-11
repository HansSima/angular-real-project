import { UiService } from './../../shared/ui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date | undefined;
  isLoading = false;
  private loadingSubscription!: Subscription;

  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    this.loadingSubscription = this.uiService.loadingStateChange.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );

    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }
}
