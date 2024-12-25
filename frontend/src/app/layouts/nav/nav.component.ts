import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  constructor(public routerService: RouterService, public authService: AuthService) { }
  auth = false
  ngOnInit(): void {
    if (this.authService.hasAuthData()) {
      this.auth = true
    }
  }
}
