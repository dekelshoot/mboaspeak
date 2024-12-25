import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';
import { TranslaterService } from 'src/app/services/translater.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  translate!: any

  constructor(public routerService: RouterService, private authService: AuthService, public translater:TranslaterService) {
    this.translate = this.translater.translate
   }

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
