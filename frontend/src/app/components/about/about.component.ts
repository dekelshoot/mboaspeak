import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

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
