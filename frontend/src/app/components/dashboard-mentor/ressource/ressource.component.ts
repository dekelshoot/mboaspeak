import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-ressource',
  templateUrl: './ressource.component.html',
  styleUrls: ['./ressource.component.scss']
})
export class RessourceComponent implements OnInit {
  active = 1
  loading = false
  user_id = null
  type: Array<string> = ["Article",
    "Livre/E-book",
    "Vidéo",
    "Podcast/Enregistrement audio",
    "Cours en ligne/MOOC",
    "Infographie/Fiche technique",
    "Guide/Manuel",
    "Outil/Template",
    "Projet pratique/Exercice",
    "Site Web/Blog"]
  domaines: Array<any> = []
  users: Array<any> = []
  ressources: Array<any> = []
  formForm!: FormGroup;

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, private routerService: RouterService) { }
  ngOnInit(): void {
    this.chargeRessource();
  }

  initFormmentor() {
    this.formForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      titre: ['', [Validators.required]],
      url: ['', [Validators.required]],
      domaine: ['', [Validators.required]],
    });
  }

  changeActive(active: number) {
    this.active = active
  }

  chargeMenttee() {
    this.changeActive(2)
    this.loading = true
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentee) {
        this.routerService.routeRoute('/auth/sign-in');
      } else {
        let data = {
          "id": user.id,
          "type_user": "mentor"
        }
        this.requestService.post("http://127.0.0.1:8000/api/connexion/", data).then(
          (res: any) => {
            this.users = res.data
            console.log(this.users)
            this.loading = false;
          }
        )
      }
    } else {
      this.routerService.routeRoute('/auth/sign-in');
    }

  }
  chargeData(id: any) {
    console.log(id)
    this.user_id = id
    this.changeActive(3)
    this.initFormmentor()
    this.loading = true
    this.requestService.getAll("http://127.0.0.1:8000/api/domaines_expertise/").then(
      (res: any) => {
        this.domaines = res.results
        console.log(this.domaines)
        this.loading = false;
      }
    )
  }

  chargeRessource() {
    this.changeActive(1)
    this.loading = true
    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      if (user.is_mentee) {
        this.routerService.routeRoute('/auth/sign-in');
      } else {
        let data = {
          "action": 4,
          "mentor": user.id
        };
        this.requestService.post("http://127.0.0.1:8000/api/ressources/", data).then(
          (res: any) => {
            console.log(res)
            this.ressources = res
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

    const type = this.formForm.get('type')?.value;
    const domaine = Number(this.formForm.get('domaine')?.value);
    const titre = this.formForm.get('titre')?.value;
    const url = this.formForm.get('url')?.value;

    const userString = localStorage.getItem('user');
    if (userString !== null) {
      const user = JSON.parse(userString);
      let data = {
        "mentor": user.id,
        "mentee": this.user_id,
        "type": type,
        "url": url,
        "domaine": domaine,
        "titre": titre,
        "action": 3
      }
      console.log(data)
      this.requestService.post("http://127.0.0.1:8000/api/ressources/", data).then(
        (res: any) => {
          if (res.data) {
            this.chargeRessource()
          }
          this.loading = false;
        }
      )
    }

  }
}
