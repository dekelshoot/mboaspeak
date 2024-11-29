import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-ressource-mentee',
  templateUrl: './ressource-mentee.component.html',
  styleUrls: ['./ressource-mentee.component.scss']
})
export class RessourceMenteeComponent implements OnInit {
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


  changeActive(active: number) {
    this.active = active
  }
  chargeRessource() {
  }
}
