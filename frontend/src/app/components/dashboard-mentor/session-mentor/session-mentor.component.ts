import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-session-mentor',
  templateUrl: './session-mentor.component.html',
  styleUrls: ['./session-mentor.component.scss']
})
export class SessionMentorComponent implements OnInit {
  active = 1
  loading = false
  user_id = null
  type: Array<string> = ["Atelier", "Session de questions-réponses", "Session de feedback", "Session de mentorat", "Session de planification de carrière", "ession de révision de CV/lettre de motivation", "Session de préparation à l'entretien", "Session de groupe "]
  disponibilite: Array<any> = []
  users: Array<any> = []
  sessions: Array<any> = []
  formForm!: FormGroup;

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, private routerService: RouterService) { }
  ngOnInit(): void {
    this.chargeSession();
  }

  initFormmentor() {
    this.formForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      commentaire: ['', [Validators.required]],
      disponibilite: ['', [Validators.required]],
    });
  }

  changeActive(active: number) {
    this.active = active
  }

  chargeMenttee() { }

  chargeData(id: any) {
    console.log(id)
    this.user_id = id
    this.changeActive(3)
    this.initFormmentor()
    this.loading = true
    this.requestService.getAll("http://127.0.0.1:8000/api/disponibilites/").then(
      (res: any) => {
        this.disponibilite = res.results
        console.log(this.disponibilite)
        this.loading = false;
      }
    )
  }

  chargeSession() {
  }

  ngOnSubmit() {
    this.loading = true;

    const type = this.formForm.get('type')?.value;
    const disponibilite = Number(this.formForm.get('disponibilite')?.value);
    const commentaire = this.formForm.get('commentaire')?.value;

    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      let data = {
        "mentor": user.id,
        "mentee": this.user_id,
        "type": type,
        "commentaire": commentaire,
        "disponibilite": disponibilite,
        "action": 1
      }
      console.log(data)
      this.requestService.post("http://127.0.0.1:8000/api/sessions/", data).then(
        (res: any) => {
          if (res.data) {
            this.chargeSession()
          }
          this.loading = false;
        }
      )
    }

  }
}
