import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from '../../../services/request.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterService } from 'src/app/services/router.service';
import { TranslaterService } from 'src/app/services/translater.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  translate!: any
  role = 1

  loadingData = true

  languages: Array<any> = [];

  formForm!: FormGroup;


  constructor(private requestService: RequestService,
    private formBuilder: FormBuilder, public routerService: RouterService, public translater:TranslaterService
  ) { this.translate = this.translater.translate}
  ngOnInit(): void {
    this.chargeData();


  }

  chargeData() {
    this.requestService.getAll2("http://127.0.0.1:8000/api/auth/language/").then((res: any) => {
      console.log(res)
      this.loadingData = false
      this.languages = res
      this.initForm()
    }, (err: any) => {
      console.log(err)
    })
  }


  initForm() {
    this.formForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      primary_language: ['', [Validators.required]],
    });
  }





  ngOnSubmit() {
    this.loadingData = true;
    const username = this.formForm.get('username')?.value;
    const email = this.formForm.get('email')?.value;
    const password = this.formForm.get('password')?.value;
    const primary_language = this.formForm.get('primary_language')?.value;

    let data = {
      "username": username,
      "email": email,
      "password": password,
      "primary_language": primary_language,
      "user_type": "contributor"
    }

    console.log(data)

    this.requestService.post("http://127.0.0.1:8000//api/auth/register/", data).then(
      (response) => {
        console.log(response)
        this.routerService.routeRoute("/auth/sign-in")
      }, (reason: any) => {
        this.loadingData = false
        console.log(reason)
      }
    )
  }

}