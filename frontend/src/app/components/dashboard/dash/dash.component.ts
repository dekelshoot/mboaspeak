import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {
  active = 1
  loading = false
  user_type = ""
  constructor(private routerService: RouterService, private authService: AuthService, private route: ActivatedRoute) { }
  ngOnInit(): void {

    const authData = localStorage.getItem('authData');
    if (!this.authService.hasAuthData()) {
      this.routerService.routeRoute("/auth/sign-in")

    }
    this.user_type = this.authService.getAuthData().user_type
    console.log(this.authService.getAuthData().user_type)
    this.route.queryParams.subscribe(params => {
      const view = params['view1'];
      if (view != undefined) {
        this.active = view
      }
    });
  }

  changeActive(active: number) {
    this.active = active;
  }

  logout() {
    this.routerService.routeRoute('/auth/sign-in');
    this.authService.clearAuthData()
  }
}
