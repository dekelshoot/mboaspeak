import { Component } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent {
  active = 1
  loading = false
  constructor(private routerService: RouterService, private authService: AuthService) { }
  ngOnInit(): void {

    const authData = localStorage.getItem('authData');
    if (!this.authService.hasAuthData()) {
      this.routerService.routeRoute("/auth/sign-in")
    }
  }

  changeActive(active: number) {
    this.active = active;
  }

  logout() {
    this.routerService.routeRoute('/auth/sign-in');
    this.authService.clearAuthData()
  }
}
