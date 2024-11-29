import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  loading = true
  sessions: Array<any> = []
  evaluations: Array<any> = []
  ressources: Array<any> = []
  mentees: Array<any> = []
  constructor(public requestService: RequestService, private routerService: RouterService) { }

  ngOnInit(): void {
    this.chargeData();
  }
  chargeData() { }
}
