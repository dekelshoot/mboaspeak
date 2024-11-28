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
  chargeData() {
    this.loading = true
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentee) {
        this.routerService.routeRoute('/auth/sign-in');
      } else {
        let data = {
          "action": 2,
          "mentor": user.id
        };
        this.requestService.post("http://127.0.0.1:8000/api/sessions/", data).then(
          (res: any) => {
            console.log(res)
            this.sessions = res
            let data = {
              "action": 4,
              "mentor": user.id
            };
            this.requestService.post("http://127.0.0.1:8000/api/ressources/", data).then(
              (res: any) => {
                console.log(res)
                this.ressources = res
                let data = {
                  "id": user.id,
                  "type_user": "mentor"
                }
                this.requestService.post("http://127.0.0.1:8000/api/connexion/", data).then(
                  (res: any) => {
                    this.mentees = res.data
                    let data = {
                      "action": 8,
                      "mentor": user.id
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
