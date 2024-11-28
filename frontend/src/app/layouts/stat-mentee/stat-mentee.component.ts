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
    this.loading = true
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentor) {
        this.routerService.routeRoute('/auth/sign-in');
      } else {
        let data = {
          "action": 5,
          "mentee": user.id
        };
        this.requestService.post("http://127.0.0.1:8000/api/sessions/", data).then(
          (res: any) => {
            console.log(res)
            this.sessions = res
            let data = {
              "action": 6,
              "mentee": user.id
            };
            this.requestService.post("http://127.0.0.1:8000/api/ressources/", data).then(
              (res: any) => {
                console.log(res)
                this.ressources = res
                let data = {
                  "id": user.id,
                  "type_user": "mentee"
                }
                this.requestService.post("http://127.0.0.1:8000/api/connexion/", data).then(
                  (res: any) => {
                    this.mentor = res.data
                    console.log(this.mentor)
                    let data = {
                      "action": 9,
                      "mentee": user.id
                    };
                    this.requestService.post("http://127.0.0.1:8000/api/evaluation/", data).then(
                      (res: any) => {
                        console.log(res)
                        this.evaluations = res
                        this.loading = false;
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    } else {
      this.routerService.routeRoute('/auth/sign-in');
    }
  }
}
