import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule],
  template: `
    @if (auth.isLoggedIn()) {
      <div class="app-header">
        <button mat-button color="warn" (click)="logout()">Logout</button>
      </div>
    }

    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-header {
      display: flex;
      justify-content: flex-end;
      padding: 10px 20px;
      background: #f5f5f5;
    }
  `]
})
export class AppComponent {
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
