import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/shared/ui.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private loadingSubscription!: Subscription;
  constructor(private authService: AuthService, private uiService: UiService) {}

  ngOnInit() {}

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  onSubmit(form: NgForm) {
    this.loadingSubscription = this.uiService.loadingStateChange.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
    this.authService.login({
      email: form.value.email,
      password: form.value.password,
    });
  }
}
