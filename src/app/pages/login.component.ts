import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <h2>Welcome Back</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onLogin()" novalidate>
        <input matInput placeholder="Username" formControlName="username" />
        <div *ngIf="submitted && loginForm.controls.username.invalid" class="error">
          Username is required
        </div>

        <input matInput type="password" placeholder="Password" formControlName="password" />
        <div *ngIf="submitted && loginForm.controls.password.invalid" class="error">
          Password is required
        </div>

        <button mat-raised-button color="primary" type="submit">Login</button>
         <p class="demo-credentials">
      Demo credentials: <strong>admin / admin</strong>
    </p>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitted = false;

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;

    if (this.auth.login(username!, password!)) {
      this.router.navigate(['/']); // redirect after successful login
    } else {
      alert('Invalid credentials');
    }
  }
}
