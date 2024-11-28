import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-evaluation-mentor',
  templateUrl: './evaluation-mentor.component.html',
  styleUrls: ['./evaluation-mentor.component.scss']
})
export class EvaluationMentorComponent implements OnInit {
  active = 1
  loading = false
  user_id = null
  type: Array<string> = ["Atelier", "Session de questions-réponses", "Session de feedback", "Session de mentorat", "Session de planification de carrière", "ession de révision de CV/lettre de motivation", "Session de préparation à l'entretien", "Session de groupe "]
  disponibilite: Array<any> = []
  users: Array<any> = []
  evaluations: Array<any> = []
  formForm!: FormGroup;

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, private routerService: RouterService) { }
  ngOnInit(): void {
    this.chargeEvaluation();
  }



  changeActive(active: number) {
    this.active = active

  }



  chargeEvaluation() {
    this.changeActive(1)
    this.loading = true
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentee) {
        this.routerService.routeRoute('/auth/sign-in');
      } else {
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
    } else {
      this.routerService.routeRoute('/auth/sign-in');
    }
  }

}
