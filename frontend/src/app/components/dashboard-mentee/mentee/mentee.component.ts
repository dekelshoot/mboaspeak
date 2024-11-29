import { Component, OnInit } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-mentee',
  templateUrl: './mentee.component.html',
  styleUrls: ['./mentee.component.scss']
})
export class MenteeComponent implements OnInit {
  active = 1
  loading = true
  constructor(private routerService: RouterService) { }
  ngOnInit(): void {

  }

  changeActive(active: number) {
    this.active = active;
  }

  logout() {
    this.routerService.routeRoute('/auth/sign-in');
    localStorage.removeItem('user')
  }
}
