import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslaterService } from 'src/app/services/translater.service';

@Component({
  selector: 'app-learning-space',
  templateUrl: './learning-space.component.html',
  styleUrls: ['./learning-space.component.scss']
})
export class LearningSpaceComponent implements OnInit {
  translate!: any
  loading = false
  formForm!: FormGroup;

  id = 1
  data: Array<any> = []
  recentlessons: Array<any> = []

  result!: any
  active = 1
  lessonView = 0
  user_type = ""
  lessonDetail!: any
  quiz!: any
  res!: any
  auth = false

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, public routerService: RouterService, public translater: TranslaterService,
    private authService: AuthService, private sanitizer: DomSanitizer
  ) { this.translate = this.translater.translate }

  ngOnInit(): void {
    if (this.authService.hasAuthData()) {
      this.auth = true
      this.user_type = this.authService.getAuthData().user_type
      console.log(this.authService.getAuthData().user_type)
    }
    this.loadData()
  }
  //



  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }





  loadData(url = this.requestService.base + "/api/learning/all/",) {
    this.loading = true
    this.requestService.getWithoutAccess(url).then(
      (res: any) => {
        this.res = res
        console.log(res)
        this.data = res
        this.loading = false
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )

  }




  loadView(id: number) {
    if (id == 3) {
      this.initForm()
      this.loadQuizData()
      console.log('Form Array:', this.questions);
    }
    this.active = id
  }



  loadlesson(id: number, view: number) {
    this.lessonView = id
    this.loading = true
    let url = this.requestService.base + "/api/learning/"
    this.requestService.getWithoutAccess(url + id + "/").then(
      (res: any) => {
        this.lessonDetail = res
        this.quiz = res.quiz
        console.log(this.quiz)
        this.lessonDetail.video_url = this.sanitizeUrl(this.lessonDetail.video_url);

        this.requestService.getWithoutAccess(this.requestService.base + "/api/learning/recent/").then(
          (res: any) => {

            this.loadView(view)
            this.loading = false

            this.recentlessons = res

          }, (err: any) => {
            this.loading = false
            console.log(err)
          }
        )
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )

  }


  getRandomElement() {
    let array = ["bg-info", "bg-success", "bg-warning", "bg-primary", "bg-danger"]
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  initForm(): void {
    this.formForm = this.formBuilder.group({
      quiz: this.formBuilder.group({
        title: ['', [Validators.required]],
        questions: this.formBuilder.array([]),
      }),
    });
  }

  get questions(): FormArray {
    return this.formForm.get('quiz.questions') as FormArray;
  }

  getChoices(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('choices') as FormArray;
  }

  loadQuizData(): void {
    const questionsArray = this.questions;
    questionsArray.clear();

    this.quiz.questions.forEach((question: any) => {
      const questionGroup = this.formBuilder.group({
        text: [question.text, Validators.required],
        choices: this.formBuilder.array(
          question.choices.map((choice: any, i: number) =>
            this.formBuilder.group({
              text: [choice.text, Validators.required],
              'is_correct': [choice.is_correct],
            })
          )
        ),
      });
      questionsArray.push(questionGroup);
    });

    this.formForm.get('quiz.title')?.setValue(this.quiz.title);
  }

  onSubmit(): void {
    if (this.formForm.valid) {
      console.log('Quiz Submitted:', this.formForm.value);
      this.loadView(4)
      this.valideQuiz()
    } else {
      console.error('Formulaire invalide');
    }

  }

  valideQuiz() {
    let valide: any = []
    this.formForm.value.quiz.questions.forEach((el: any, id: number) => {
      valide[id] = false
      el.choices.forEach((choice: any, id2: number) => {
        if (this.quiz.questions[id].choices[id2].is_correct) {
          if (choice.is_correct == undefined) {
            valide[id] = true
          }
        }
      })
    })
    this.result = valide
    console.log(valide)
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


}
