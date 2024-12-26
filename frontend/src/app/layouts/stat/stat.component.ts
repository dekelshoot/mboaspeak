import { AnimationPlayer } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  loading = false
  sessions: Array<any> = []
  evaluations: Array<any> = []
  ressources: Array<any> = []
  mentees: Array<any> = []
  stat!: any
  constructor(public requestService: RequestService, private routerService: RouterService) { }

  ngOnInit(): void {
    this.chargeData();
  }

  chargeData() {
    this.loading = true
    this.requestService.getAll(this.requestService.base + "/api/admin/stat/").then(
      (res: any) => {
        console.log(res)
        this.stat = res
        this.loading = false
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }
}
