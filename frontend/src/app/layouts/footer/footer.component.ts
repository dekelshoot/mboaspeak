import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';
import { TranslaterService } from 'src/app/services/translater.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor(public routerService: RouterService, public authService: AuthService, public translate: TranslaterService) { }

  auth = false
  ngOnInit(): void {
    if (this.authService.hasAuthData()) {
      this.auth = true
    }
  }
  logout() {
    this.routerService.routeRoute('/auth/sign-in');
    this.authService.clearAuthData()
    this.ngOnInit()
  }
}
