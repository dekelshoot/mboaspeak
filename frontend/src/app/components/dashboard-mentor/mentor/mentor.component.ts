import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../../services/router.service';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.scss']
})
export class MentorComponent implements OnInit {
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
