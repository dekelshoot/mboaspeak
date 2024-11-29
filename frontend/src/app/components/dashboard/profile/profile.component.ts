import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  active = 1
  loading = false
  languages: Array<string> = ["english", "french", "camfranglais", "pidgin"]
  disabled = true
  word_edit!: any
  words: any = {}
  user_id = null
  user!: any
  formForm!: FormGroup;

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, private routerService: RouterService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (!this.authService.hasAuthData()) {
      this.routerService.routeRoute("/auth/sign-in")
    }
    let user = this.authService.getAuthData()
    this.initForm()
    let data = {
      username: user.username,
      email: user.email,
      primary_language: user.primary_language,
    }
    this.user = user

    this.formForm.setValue(data)

  }

  initForm() {
    this.formForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      primary_language: ['', [Validators.required]],
    });
  }



  edit(id: number) {
    console.log(id)
    this.loading = true

    this.requestService.getWithAccess("http://127.0.0.1:8000/api/dico/word", id).then(
      (res: any) => {
        this.word_edit = res
        console.log(this.word_edit)
        this.loading = false;
        this.initForm()
        let data = {
          word_name: res.word_name,
          definition: res.definition,
          lang_definition: res.lang_definition,
          meaning_fr: res.meaning_fr,
          meaning_en: res.meaning_en,
          language: res.language,
        }

        this.formForm.setValue(data)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }




  ngOnSubmit() {
    this.loading = true;

    const username = this.formForm.get('username')?.value;
    const email = this.formForm.get('email')?.value;
    const primary_language = this.formForm.get('primary_language')?.value;




    if (this.authService.hasAuthData()) {
      let data = {
        "username": username,
        "email": email,
        "primary_language": primary_language,

      }
      console.log(data)
      this.ngOnInit()
      this.loading = false
      // this.requestService.update("http://127.0.0.1:8000/api/dico/word/update", this.word_edit.id, data).then(
      //   (res: any) => {
      //     this.loadView(1)
      //   }, (err: any) => {
      //     this.loading = false
      //     console.log(err)
      //   }
      // )
    }

  }
}
