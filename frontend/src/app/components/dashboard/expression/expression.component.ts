import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent implements OnInit {
  active = 1
  loading = false
  languages: Array<string> = ["english", "french", "camfranglais", "pidgin"]

  expression_edit!: any
  expressions: any = []
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
    this.loadExpression();
  }

  initForm() {
    this.formForm = this.formBuilder.group({
      exp: ['', [Validators.required]],
      language: ['', [Validators.required]],
      meaning_fr: ['', [Validators.required]],
      meaning_en: ['', [Validators.required]],
    });
  }


  loadExpression() {
    this.loading = true
    this.requestService.getAll(this.requestService.base + "/api/expression/").then(
      (res: any) => {
        this.expressions = res.expressions
        console.log(this.expressions)
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

    this.requestService.getWithAccess(this.requestService.base + "/api/expression", id).then(
      (res: any) => {
        this.expression_edit = res
        console.log(this.expression_edit)
        this.loading = false;
        this.loadView(3)
        this.initForm()
        let data = {
          exp: res.exp,
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



  loadView(id: number) {
    this.active = id

  }

  ngOnSubmit() {
    this.loading = true;

    const definition = this.formForm.get('definition')?.value;
    const exp = this.formForm.get('exp')?.value;
    const meaning_fr = this.formForm.get('meaning_fr')?.value;
    const meaning_en = this.formForm.get('meaning_en')?.value;
    const language = this.formForm.get('language')?.value;



    if (this.authService.hasAuthData()) {
      let data = {
        "exp": exp,
        "definition": definition,
        "meaning_fr": meaning_fr,
        "meaning_en": meaning_en,
        "language": language,


      }
      console.log(data)
      this.requestService.postWithAccess(this.requestService.base + "/api/expression/", data).then(
        (res: any) => {
          this.loadView(1)
          this.loadExpression()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }

  ngOnSubmitEdit() {
    this.loading = true;

    const definition = this.formForm.get('definition')?.value;
    const exp = this.formForm.get('exp')?.value;
    const meaning_fr = this.formForm.get('meaning_fr')?.value;
    const meaning_en = this.formForm.get('meaning_en')?.value;
    const language = this.formForm.get('language')?.value;



    if (this.authService.hasAuthData()) {
      let data = {
        "exp": exp,
        "definition": definition,
        "meaning_fr": meaning_fr,
        "meaning_en": meaning_en,
        "language": language,

      }
      console.log(data)
      this.requestService.update(this.requestService.base + "/api/expression/update", this.expression_edit.id, data).then(
        (res: any) => {
          this.loadView(1)
          this.loadExpression()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }
}
