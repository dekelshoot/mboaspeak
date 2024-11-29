import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-stat-mentee',
  templateUrl: './stat-mentee.component.html',
  styleUrls: ['./stat-mentee.component.scss']
})
export class StatMenteeComponent implements OnInit {

  loading = true
  sessions: Array<any> = []
  ressources: Array<any> = []
  evaluations: Array<any> = []
  mentor!: any
  constructor(public requestService: RequestService, private routerService: RouterService) { }

  ngOnInit(): void {
    this.chargeData();
  }
  chargeData() {

  }
}
