import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-evaluation-mentee',
  templateUrl: './evaluation-mentee.component.html',
  styleUrls: ['./evaluation-mentee.component.scss']
})
export class EvaluationMenteeComponent implements OnInit {
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

  initFormmentee() {
    this.formForm = this.formBuilder.group({
      note: ['', [Validators.required]],
      commentaire: ['', [Validators.required]],
    });
  }

  changeActive(active: number) {
    this.active = active
    if (active == 2) {
      this.initFormmentee()
    }
  }



  chargeEvaluation() {
    this.changeActive(1)
    this.loading = true
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentor) {
        this.routerService.routeRoute('/auth/sign-in');
      } else {
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
    } else {
      this.routerService.routeRoute('/auth/sign-in');
    }
  }

  ngOnSubmit() {
    this.loading = true;

    const note = this.formForm.get('note')?.value;
    const commentaire = this.formForm.get('commentaire')?.value;
    const today = new Date();
    const formattedDate = this.getFormattedDate(today);
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      let data = {
        "mentee": user.id,
        "date": formattedDate,
        "commentaire": commentaire,
        "note": note,
        "action": 7
      }
      console.log(data)
      this.requestService.post("http://127.0.0.1:8000/api/evaluation/", data).then(
        (res: any) => {
          if (res.data) {
            this.chargeEvaluation()
          }
          this.loading = false;
        }
      )
    }

  }

  getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
