import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../../services/rest-api.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.less',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
  ],
  standalone: true,
})
export class LoginFormComponent {
  public form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  @Output() login = new EventEmitter<string>();

  private destroyRef = inject(DestroyRef);

  constructor(private apiService: ApiService) {}

  submit() {
    const { username, password } = this.form.value;
    this.apiService
      .getToken(username, password)
      .pipe(catchError((error) => of(error)))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (res?.status === 401) {
          this.form.setErrors({ incorrect: true });
        } else if (res?.access_token) {
          this.login.next(res.access_token);
        }
      });
  }
}
