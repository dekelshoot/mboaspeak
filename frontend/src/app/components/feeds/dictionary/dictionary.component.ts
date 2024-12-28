import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';
import { TranslaterService } from 'src/app/services/translater.service';
@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss']
})
export class DictionaryComponent implements OnInit {
  translate!: any
  loading = false
  formForm!: FormGroup;
  id = 1
  data: Array<any> = []
  topWords: Array<any> = []
  recentWords: Array<any> = []
  active = 1
  wordView = 0
  user_type = ""
  wordDetail!: any
  res!: any
  auth = false
  constructor(public requestService: RequestService, private formBuilder: FormBuilder, public routerService: RouterService,
    private authService: AuthService, public translater: TranslaterService
  ) { this.translate = this.translater.translate }

  ngOnInit(): void {
    if (this.authService.hasAuthData()) {
      this.auth = true
      this.user_type = this.authService.getAuthData().user_type
      console.log(this.authService.getAuthData().user_type)
    }
    this.loadData()
  }

  initForm() {
    this.formForm = this.formBuilder.group({
      search: ['', [Validators.required]],
    });
  }

  next() {
    this.loadData(this.res.next)

  }

  isLinguist() {
    return this.user_type == 'linguist'
  }

  loadData(url = this.requestService.base + "api/dico/word/?page=1") {
    this.loading = true
    this.requestService.getWithoutAccess(url).then(
      (res: any) => {
        this.res = res
        res.results.results.forEach((element: any) => {
          this.data.push(element)
        });
        this.requestService.getWithoutAccess(this.requestService.base + "api/dico/word/top-voted/").then(
          (res: any) => {
            this.res = res
            this.topWords = res.top_words
            console.log(res)
            this.requestService.getWithoutAccess(this.requestService.base + "api/dico/word/recentWord/").then(
              (res: any) => {
                this.res = res
                this.recentWords = res.recent_words
                console.log(res)

                console.log(this.data)
                this.loading = false
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
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
    this.initForm()
  }


  loadView(id: number) {
    this.active = id
  }

  allowLike(wordDetail: any) {
    if (this.auth) {
      if (!wordDetail.disliked) {
        if (wordDetail.liked) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  allowDisLike(wordDetail: any) {
    if (this.auth) {
      if (!wordDetail.liked) {
        if (wordDetail.disliked) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  allowStar(wordDetail: any) {
    if (this.auth) {
      if (this.isLinguist()) {
        if (wordDetail.stared) {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  loadWord(id: number, view: number) {
    console.log(id)
    this.wordView = id
    this.loading = true
    let url = ""
    if (this.authService.hasAuthData()) {
      url = this.requestService.base + "api/dico/word-with-access"
      this.requestService.getWithAccess(url, id).then(
        (res: any) => {
          this.wordDetail = res
          this.loadView(view)
          this.loading = false
          console.log(res)
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    } else {
      url = this.requestService.base + "api/dico/word/"
      this.requestService.getWithoutAccess(url + id + "/").then(
        (res: any) => {
          this.wordDetail = res
          this.loadView(view)
          this.loading = false
          console.log(res)
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }

  ngOnSubmit() {
    this.loading = true;

    const search = this.formForm.get('search')?.value;



    this.loading = true
    this.requestService.getWithoutAccess(this.requestService.base + "api/dico/word/search/?query=" + search).then(
      (res: any) => {
        this.data = res.results
        this.loadView(2)
        console.log(this.data)
        this.loading = false
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )

  }

  vote(id: number, i: number) {
    console.log(id)
    let data = {}
    this.loading = true
    this.requestService.postWithAccess(this.requestService.base + "/api/dico/word/vote/" + id + "/", data).then(
      (res: any) => {
        console.log(res)

        this.requestService.getWithAccess(this.requestService.base + "/api/dico/word", id).then(
          (res: any) => {
            console.log(res)
            this.data[i] = res
            this.loading = false


          }, (err: any) => {

            console.log(err)
          }
        )
        this.loading = false
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }

  onVote(id: number, view: number) {
    console.log(id)
    let data = {}
    this.loading = true
    this.requestService.postWithAccess(this.requestService.base + "/api/dico/word/vote/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadWord(id, view)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }

  onDislike(id: number, view: number) {
    console.log(id)
    let data = {}
    this.loading = true
    this.requestService.postWithAccess(this.requestService.base + "/api/dico/word/dislike/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadWord(id, view)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }

  onStar(id: number, view: number) {
    console.log(id)
    let data = {}
    this.loading = true
    this.requestService.postWithAccess(this.requestService.base + "/api/dico/word/star/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadWord(id, view)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }
}
