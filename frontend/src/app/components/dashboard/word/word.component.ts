import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';


@Component({
  selector: 'app-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.scss']
})
export class WordComponent implements OnInit {
  active = 1
  loading = false
  languages: Array<string> = ["english", "french", "camfranglais", "pidgin"]

  word_edit!: any
  words: any = {}
  user_id = null

  formForm!: FormGroup;

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, public routerService: RouterService,
    private authService: AuthService, private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    const authData = localStorage.getItem('authData');
    if (!this.authService.hasAuthData()) {
      this.routerService.routeRoute("/auth/sign-in")
    }

    this.route.queryParams.subscribe(params => {
      const view = params['view2'];
      if (view != undefined) {
        this.active = view
      }
    });
    this.loadWord();
  }

  initForm() {
    this.formForm = this.formBuilder.group({
      word_name: ['', [Validators.required]],
      language: ['', [Validators.required]],
      definition: ['', [Validators.required]],
      lang_definition: ['', [Validators.required]],
      meaning_fr: ['', [Validators.required]],
      meaning_en: ['', [Validators.required]],
      example: ['', [Validators.required]],
    });
  }


  loadWord() {
    this.loading = true
    this.requestService.getAll("http://127.0.0.1:8000/api/dico/word/my-words/").then(
      (res: any) => {
        this.words = res.words
        console.log(this.words)
        this.loading = false;
        this.initForm()
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )

  }

  edit(id: number) {
    console.log(id)
    this.loading = true

    this.requestService.getWithAccess("http://127.0.0.1:8000/api/dico/word", id).then(
      (res: any) => {
        this.word_edit = res
        console.log(this.word_edit)
        this.loading = false;
        this.loadView(3)
        this.initForm()
        let data = {
          word_name: res.word_name,
          definition: res.definition,
          lang_definition: res.lang_definition,
          meaning_fr: res.meaning_fr,
          meaning_en: res.meaning_en,
          language: res.language,
          example: res.example,
        }

        this.formForm.setValue(data)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }



  loadView(id: number) {
    this.active = id

  }

  ngOnSubmit() {
    this.loading = true;

    const word_name = this.formForm.get('word_name')?.value;
    const definition = this.formForm.get('definition')?.value;
    const lang_definition = this.formForm.get('lang_definition')?.value;
    const meaning_fr = this.formForm.get('meaning_fr')?.value;
    const meaning_en = this.formForm.get('meaning_en')?.value;
    const language = this.formForm.get('language')?.value;
    const example = this.formForm.get('example')?.value;


    if (this.authService.hasAuthData()) {
      let data = {
        "word_name": word_name,
        "definition": definition,
        "lang_definition": lang_definition,
        "meaning_fr": meaning_fr,
        "meaning_en": meaning_en,
        "language": language,
        "example": example

      }
      console.log(data)
      this.requestService.postWithAccess("http://127.0.0.1:8000/api/dico/word/create/", data).then(
        (res: any) => {
          this.loadView(1)
          this.loadWord()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }

  ngOnSubmitEdit() {
    this.loading = true;

    const word_name = this.formForm.get('word_name')?.value;
    const definition = this.formForm.get('definition')?.value;
    const lang_definition = this.formForm.get('lang_definition')?.value;
    const meaning_fr = this.formForm.get('meaning_fr')?.value;
    const meaning_en = this.formForm.get('meaning_en')?.value;
    const language = this.formForm.get('language')?.value;
    const example = this.formForm.get('example')?.value;



    if (this.authService.hasAuthData()) {
      let data = {
        "word_name": word_name,
        "definition": definition,
        "lang_definition": lang_definition,
        "meaning_fr": meaning_fr,
        "meaning_en": meaning_en,
        "language": language,
        "example": example,

      }
      console.log(data)
      this.requestService.update("http://127.0.0.1:8000/api/dico/word/update", this.word_edit.id, data).then(
        (res: any) => {
          this.loadView(1)
          this.loadWord()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }
}
