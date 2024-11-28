import { Component } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  constructor(public routerService: RouterService) { }

  start() {
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentor) {
        this.routerService.routeRoute('/dashboard/mentor');
      } else {
        if (user.is_mentee) {
          this.routerService.routeRoute('/dashboard/mentee');
        } else {
          this.routerService.routeRoute('/auth/sign-in');
        }
      }
    } else {
      this.routerService.routeRoute('/auth/sign-in');
    }
  }
}
