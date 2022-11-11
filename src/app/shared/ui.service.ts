import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  loadingStateChange = new Subject<boolean>();

  constructor(private snackbar: MatSnackBar) {}

  showSnackbar(message: string, action: string | undefined, duration: number) {
    this.snackbar.open(message, action, {
      duration: duration,
    });
  }
}
