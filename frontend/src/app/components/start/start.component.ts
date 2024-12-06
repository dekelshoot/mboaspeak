import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  constructor(public routerService: RouterService, private authService: AuthService) { }

  start() {
    this.routerService.routeRoute('/feed/dictionary')
  }

  onJoin() {
    if (this.authService.hasAuthData()) {
      this.routerService.routeRoute('/feed/dictionary')
    } else {
      this.routerService.routeRoute('/auth/sign-up')
    }
  }
}
