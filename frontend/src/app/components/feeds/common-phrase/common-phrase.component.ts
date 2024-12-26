import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';
import { TranslaterService } from 'src/app/services/translater.service';
@Component({
  selector: 'app-common-phrase',
  templateUrl: './common-phrase.component.html',
  styleUrls: ['./common-phrase.component.scss']
})
export class CommonPhraseComponent implements OnInit {
  translate!: any
  loading = false
  formForm!: FormGroup;
  id = 1
  data: Array<any> = []
  topExpressions: Array<any> = []
  recentExpressions: Array<any> = []
  active = 1
  expressionView = 0
  user_type = ""
  expressionDetail!: any
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


  isLinguist() {
    return this.user_type == 'linguist'
  }

  loadData() {
    this.loading = true
    this.requestService.getWithoutAccess(this.requestService.base + "/api/expression/top-voted/").then(
      (res: any) => {
        this.res = res
        this.topExpressions = res.top_expressions
        console.log(res)
        this.requestService.getWithoutAccess(this.requestService.base + "/api/expression/recent-expression/").then(
          (res: any) => {
            this.res = res
            this.recentExpressions = res.recent_expressions
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
    this.initForm()
  }


  loadView(id: number) {
    this.active = id
  }

  allowLike(expressionDetail: any) {
    if (this.auth) {
      if (!expressionDetail.disliked) {
        if (expressionDetail.liked) {
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

  allowDisLike(expressionDetail: any) {
    if (this.auth) {
      if (!expressionDetail.liked) {
        if (expressionDetail.disliked) {
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

  allowStar(expressionDetail: any) {
    if (this.auth) {
      if (this.isLinguist()) {
        if (expressionDetail.stared) {
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

  loadexpression(id: number, view: number) {
    console.log(id)
    this.expressionView = id
    this.loading = true
    let url = ""
    if (this.authService.hasAuthData()) {
      url = this.requestService.base + "/api/expression/with-access"
      this.requestService.getWithAccess(url, id).then(
        (res: any) => {
          this.expressionDetail = res
          this.loadView(view)
          this.loading = false
          console.log(res)
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    } else {
      url = this.requestService.base + "/api/expression/"
      this.requestService.getWithoutAccess(url + id + "/").then(
        (res: any) => {
          this.expressionDetail = res
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
    this.requestService.getWithoutAccess(this.requestService.base + "/api/expression/search/?query=" + search).then(
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
    this.requestService.postWithAccess(this.requestService.base + "//api/dico/expression/vote/" + id + "/", data).then(
      (res: any) => {
        console.log(res)

        this.requestService.getWithAccess(this.requestService.base + "//api/dico/expression", id).then(
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
    this.requestService.postWithAccess(this.requestService.base + "/api/expression/vote/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadexpression(id, view)
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
    this.requestService.postWithAccess(this.requestService.base + "/api/expression/dislike/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadexpression(id, view)
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
    this.requestService.postWithAccess(this.requestService.base + "/api/expression/star/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadexpression(id, view)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }
}
