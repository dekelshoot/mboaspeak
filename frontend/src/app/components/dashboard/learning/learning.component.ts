import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss']
})
export class LearningComponent implements OnInit {
  active = 1
  loading = false
  languages: Array<string> = ["english", "french", "camfranglais", "pidgin"]

  course_edit!: any
  courses: any = []
  user_id = null

  formForm!: FormGroup;


  //
  lessonForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  //

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
    this.loadcourse();
  }

  initForm() {
    this.formForm = this.formBuilder.group({
      exp: ['', [Validators.required]],
      language: ['', [Validators.required]],
      meaning_fr: ['', [Validators.required]],
      meaning_en: ['', [Validators.required]],
    });
  }

  //
  initForm2() {
    this.lessonForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      video_url: ['', [Validators.required, Validators.pattern(/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/)]],
      content: ['', [Validators.required]],
      language: ['', [Validators.required]],
      quiz: this.formBuilder.group({
        title: ['', [Validators.required]],
        questions: this.formBuilder.array([
          this.formBuilder.group({
            text: [''], // Contrôle pour le texte de la question
            choices: this.formBuilder.array([ // Tableau de choix
              this.formBuilder.group({
                text: [''], // Texte du choix
                is_correct: [false] // Booléen indiquant si c'est correct
              })
            ])
          })
        ]), // Ajouter des questions dynamiquement
      }),
    });
  }


  // Accéder au FormArray de questions
  get questions(): FormArray {
    return this.lessonForm.get('quiz.questions') as FormArray;
  }

  getChoices(question: AbstractControl): FormArray {
    return (question.get('choices') as FormArray) || this.formBuilder.array([]);
  }

  // Ajouter une nouvelle question
  addQuestion() {
    const question = this.formBuilder.group({
      text: ['', Validators.required],
      choices: this.formBuilder.array([
        this.formBuilder.group({ text: '', is_correct: false }),
        this.formBuilder.group({ text: '', is_correct: false }),
      ]),
    });
    this.questions.push(question);
  }

  addChoice(questionIndex: number) {
    const choices = (this.questions as any).at(questionIndex).get('choices');
    choices.push(this.formBuilder.group({ text: '', is_correct: false }));
  }

  removeQuestion(index: number) {
    (this.questions as any).removeAt(index);
  }

  onSubmit() {
    this.loading = true
    console.log(this.lessonForm.value)
    if (this.lessonForm.valid) {
      this.requestService.postWithAccess("http://127.0.0.1:8000/api/learning/", this.lessonForm.value).then(
        (res: any) => {
          this.loadView(1)
          this.loadcourse()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )

    }
  }

  //

  loadcourse() {
    this.loading = true
    this.requestService.getAll("http://127.0.0.1:8000/api/learning/user-lessons/").then(
      (res: any) => {
        this.courses = res
        console.log(res)
        this.loading = false;
        this.initForm2()
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )

  }

  edit(id: number) {
    console.log(id)
    this.loading = true

    this.requestService.getWithAccess("http://127.0.0.1:8000/api/learning", id).then(
      (res: any) => {
        this.course_edit = res
        console.log(this.course_edit)
        let data = {

          content: res.content,
          language: res.language,
          title: res.title,
          video_url: res.video_url,
          quiz: res.quiz,
        }
        data = this.removeIdsNonRecursive(data)
        console.log(data)
        this.loading = false;
        this.loadView(3)
        this.initForm2()
        this.lessonForm.setValue(data)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }

  removeIdsNonRecursive(obj: any): any {
    const stack: Array<{ parent: any; key: string | null }> = [
      { parent: { root: obj }, key: "root" },
    ]; // Une pile pour gérer l'itération

    while (stack.length > 0) {
      const { parent, key } = stack.pop()!;

      const current = key === null ? parent : parent[key];

      if (Array.isArray(current)) {
        current.forEach((item, index) =>
          stack.push({ parent: current, key: index.toString() })
        );
      } else if (typeof current === "object" && current !== null) {
        Object.keys(current).forEach((k) => {
          if (k === "id") {
            delete current[k];
          } else {
            stack.push({ parent: current, key: k });
          }
        });
      }
    }

    return obj;
  }



  loadView(id: number) {
    this.active = id
    if (id == 2) {
      this.initForm2()
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
      this.requestService.update("http://127.0.0.1:8000/api/course/update", this.course_edit.id, data).then(
        (res: any) => {
          this.loadView(1)
          this.loadcourse()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }
}
