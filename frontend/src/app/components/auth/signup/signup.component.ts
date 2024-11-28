import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../services/request.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  role = 1
  domaineExpertise: Array<any> = [];
  qualifications: Array<any> = [];
  experiences: Array<any> = [];
  preferences: Array<any> = [];
  langues: Array<any> = [];
  disponibilite: Array<any> = [];
  niveau_education: Array<any> = [];
  loadingData = true

  formForm!: FormGroup;


  constructor(private requestService: RequestService,
    private formBuilder: FormBuilder, public routerService: RouterService
  ) { }
  ngOnInit(): void {
    this.chargeDataMentor();


  }

  chargeDataMentor() {
    this.requestService.getAll("http://127.0.0.1:8000/api/domaines_expertise/").then((res: any) => {
      this.domaineExpertise = res.results
      console.log(this.domaineExpertise[0].name)

      this.requestService.getAll("http://127.0.0.1:8000/api/qualifications/").then((res: any) => {
        this.qualifications = res.results

        this.requestService.getAll("http://127.0.0.1:8000/api/experiences/").then((res: any) => {
          this.experiences = res.results

          this.requestService.getAll("http://127.0.0.1:8000/api/preferences/").then((res: any) => {
            this.preferences = res.results

            this.requestService.getAll("http://127.0.0.1:8000/api/langues/").then((res: any) => {
              this.langues = res.results

              this.requestService.getAll("http://127.0.0.1:8000/api/disponibilites/").then((res: any) => {
                this.disponibilite = res.results

                this.requestService.getAll("http://127.0.0.1:8000/api/niveau_education/").then((res: any) => {
                  this.niveau_education = res.results
                  this.loadingData = false
                  this.changeRole(1)
                }, (err: any) => {
                  console.log(err)
                })
              }, (err: any) => {
                console.log(err)
              })

            }, (err: any) => {
              console.log(err)
            })

          }, (err: any) => {
            console.log(err)
          })

        }, (err: any) => {
          console.log(err)
        })

      }, (err: any) => {
        console.log(err)
      })

    }, (err: any) => {
      console.log(err)
    })
  }


  initFormmentor() {
    this.formForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      domaines_expertise: new FormArray([], Validators.required),
      qualifications: new FormArray([], Validators.required),
      experiences: new FormArray([], Validators.required),
      preferences: new FormArray([], Validators.required),
      langues: new FormArray([], Validators.required),
      disponibilite: new FormArray([], Validators.required),
    });
  }

  initFormmentee() {
    this.formForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      centres_interet: new FormArray([]),
      objectifs: new FormArray([]),
      competences_actuelles: new FormArray([]),
      niveau_education: new FormArray([]),
      langues: new FormArray([]),
      disponibilite: new FormArray([]),
    });
  }

  changeRole(role: number): void {
    this.role = role

    if (role == 1) {
      this.initFormmentor();
      // domaine_expertise
      const formArray = this.formForm.get('domaines_expertise') as FormArray;
      this.domaineExpertise.forEach((domaine: any) => {
        formArray.push(
          new FormGroup({
            id: new FormControl(domaine.id),
            name: new FormControl(domaine.name),
            checked: new FormControl(false),
          })
        );
      });
      // qualification
      const formArray2 = this.formForm.get('qualifications') as FormArray;
      this.qualifications.forEach((qualification: any) => {
        formArray2.push(
          new FormGroup({
            id: new FormControl(qualification.id),
            name: new FormControl(qualification.name),
            checked: new FormControl(false),
          })
        );
      });

      // experiences
      const formArray3 = this.formForm.get('experiences') as FormArray;
      this.experiences.forEach((experience: any) => {
        formArray3.push(
          new FormGroup({
            id: new FormControl(experience.id),
            name: new FormControl(experience.years),
            checked: new FormControl(false),
          })
        );
      });

      // preferences
      const formArray4 = this.formForm.get('preferences') as FormArray;
      this.preferences.forEach((preference: any) => {
        formArray4.push(
          new FormGroup({
            id: new FormControl(preference.id),
            name: new FormControl(preference.name),
            checked: new FormControl(false),
          })
        );
      });

      // langues
      const formArray5 = this.formForm.get('langues') as FormArray;
      this.langues.forEach((langue: any) => {
        formArray5.push(
          new FormGroup({
            id: new FormControl(langue.id),
            name: new FormControl(langue.name),
            checked: new FormControl(false),
          })
        );
      });

      // disponibilite
      const formArray6 = this.formForm.get('disponibilite') as FormArray;
      this.disponibilite.forEach((disponibilite: any) => {
        formArray6.push(
          new FormGroup({
            id: new FormControl(disponibilite.id),
            name: new FormControl([disponibilite.day, 'de', disponibilite.start_time, 'à', disponibilite.end_time].join(" ")),
            checked: new FormControl(false),
          })
        );
      });


    } else {
      this.initFormmentee();
      // centres_interet
      const formArray = this.formForm.get('centres_interet') as FormArray;
      this.domaineExpertise.forEach((domaine: any) => {
        formArray.push(
          new FormGroup({
            id: new FormControl(domaine.id),
            name: new FormControl(domaine.name),
            checked: new FormControl(false),
          })
        );
      });
      // Objectid
      const formArray2 = this.formForm.get('objectifs') as FormArray;
      this.domaineExpertise.forEach((domaineExpertise: any) => {
        formArray2.push(
          new FormGroup({
            id: new FormControl(domaineExpertise.id),
            name: new FormControl(domaineExpertise.name),
            checked: new FormControl(false),
          })
        );
      });

      // experiences
      const formArray3 = this.formForm.get('niveau_education') as FormArray;
      this.niveau_education.forEach((niveau_education: any) => {
        formArray3.push(
          new FormGroup({
            id: new FormControl(niveau_education.id),
            name: new FormControl(niveau_education.level),
            checked: new FormControl(false),
          })
        );
      });

      // preferences
      const formArray4 = this.formForm.get('competences_actuelles') as FormArray;
      this.qualifications.forEach((qualification: any) => {
        formArray4.push(
          new FormGroup({
            id: new FormControl(qualification.id),
            name: new FormControl(qualification.name),
            checked: new FormControl(false),
          })
        );
      });

      // langues
      const formArray5 = this.formForm.get('langues') as FormArray;
      this.langues.forEach((langue: any) => {
        formArray5.push(
          new FormGroup({
            id: new FormControl(langue.id),
            name: new FormControl(langue.name),
            checked: new FormControl(false),
          })
        );
      });

      // disponibilite
      const formArray6 = this.formForm.get('disponibilite') as FormArray;
      this.disponibilite.forEach((disponibilite: any) => {
        formArray6.push(
          new FormGroup({
            id: new FormControl(disponibilite.id),
            name: new FormControl([disponibilite.day, 'de', disponibilite.start_time, 'à', disponibilite.end_time].join(" ")),
            checked: new FormControl(false),
          })
        );
      });
    }
  }

  ngOnSubmit1() {
    this.loadingData = true;
    console.log("submit 1")
    const username = this.formForm.get('username')?.value;
    const email = this.formForm.get('email')?.value;
    const password = this.formForm.get('password')?.value;
    const first_name = this.formForm.get('first_name')?.value;
    const last_name = this.formForm.get('last_name')?.value;
    const domaines_expertise = this.formForm.get('domaines_expertise')?.value.filter((value: any) => value.checked);
    const qualifications = this.formForm.get('qualifications')?.value.filter((value: any) => value.checked);
    const experiences = this.formForm.get('experiences')?.value.filter((value: any) => value.checked);
    const preferences = this.formForm.get('preferences')?.value.filter((value: any) => value.checked);
    const langues = this.formForm.get('langues')?.value.filter((value: any) => value.checked);
    const disponibilite = this.formForm.get('disponibilite')?.value.filter((value: any) => value.checked);

    let data = {
      "username": username,
      "email": email,
      "password": password,
      "first_name": first_name,
      "last_name": last_name,
      "domaines_expertise": this.ngGetId(domaines_expertise),
      "qualifications": this.ngGetId(qualifications),
      "experiences": this.ngGetId(experiences),
      "preferences": this.ngGetId(preferences),
      "langues": this.ngGetId(langues),
      "disponibilite": this.ngGetId(disponibilite)
    }

    console.log(data)

    this.requestService.post("http://127.0.0.1:8000/api/mentors/", data).then(
      (response) => {
        console.log(response)
        this.routerService.routeRoute("/auth/sign-in")
      }, (reason: any) => {
        this.loadingData = false
        console.log(reason)
      }
    )
  }

  ngOnSubmit2() {
    this.loadingData = true;
    console.log("submit 2")

    const username = this.formForm.get('username')?.value;
    const email = this.formForm.get('email')?.value;
    const password = this.formForm.get('password')?.value;
    const first_name = this.formForm.get('first_name')?.value;
    const last_name = this.formForm.get('last_name')?.value;
    const centres_interet = this.formForm.get('centres_interet')?.value.filter((value: any) => value.checked);
    const objectifs = this.formForm.get('objectifs')?.value.filter((value: any) => value.checked);
    const competences_actuelles = this.formForm.get('competences_actuelles')?.value.filter((value: any) => value.checked);
    const niveau_education = this.formForm.get('niveau_education')?.value.filter((value: any) => value.checked);
    const langues = this.formForm.get('langues')?.value.filter((value: any) => value.checked);
    const disponibilite = this.formForm.get('disponibilite')?.value.filter((value: any) => value.checked);

    let data = {
      "username": username,
      "email": email,
      "password": password,
      "first_name": first_name,
      "last_name": last_name,
      "centres_interet": this.ngGetId(centres_interet),
      "objectifs": this.ngGetId(objectifs),
      "competences_actuelles": this.ngGetId(competences_actuelles),
      "niveau_education": this.ngGetId(niveau_education),
      "langues": this.ngGetId(langues),
      "disponibilite": this.ngGetId(disponibilite)
    }

    console.log(data)

    this.requestService.post("http://127.0.0.1:8000/api/mentees/", data).then(
      (response) => {
        console.log(response)
        this.routerService.routeRoute("/auth/sign-in")
      }, (reason: any) => {
        this.loadingData = false
        console.log(reason)
      }
    )
  }

  ngGetId(elements: any) {
    let ids: any[] = []
    elements.forEach((element: any) => {
      ids.push(element.id)
    });
    return ids
  }

}
