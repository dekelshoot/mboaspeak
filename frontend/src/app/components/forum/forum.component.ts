import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';
import { TranslaterService } from 'src/app/services/translater.service';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  translate!: any
  loading = false
  formForm!: FormGroup;
  formFormOrder!: FormGroup;
  formFormPost!: FormGroup;
  id = 1
  data: Array<any> = []
  topPosts: Array<any> = []
  topCommented: Array<any> = []
  stat: any = {}
  active = 1
  postView = 0
  user_type = ""
  postDetail!: any
  res!: any
  auth = false
  next_page = false
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
      comment: ['', [Validators.required]],
    });
  }
  initForm2() {
    this.formFormOrder = this.formBuilder.group({
      language: ['language', [Validators.required]],
      order: ['filter_by', [Validators.required]],
    });


  }


  next() {
    this.loadData(this.res.next)

  }

  isLinguist() {
    return this.user_type == 'linguist'
  }

  isAdmin() {
    return this.user_type == 'admin'
  }

  onChangeLanguage() {
    console.log(this.formFormOrder.get('language')?.value)
    const language = this.formFormOrder.get('language')?.value
    if (language != "language") {
      this.loadData(this.requestService.base + "/api/post/page/", "?language=" + language)
    }
  }
  onChangeOrder() {
    const order = this.formFormOrder.get('order')?.value
    if (order != "filter_by") {
      this.loadData(this.requestService.base + "/api/post/page/", "?order_by=" + order)
    }
  }

  loadData(url = this.requestService.base + "/api/post/page/", filter = "") {
    this.loading = true
    this.requestService.getWithoutAccess(url + filter).then(
      (res: any) => {
        this.res = res
        this.next_page = res.next === null ? false : true
        console.log(this.next_page)
        console.log(res)
        this.data = res.results
        // res.results.forEach((element: any) => {
        //   this.data.push(element)
        // });
        this.requestService.getWithoutAccess(this.requestService.base + "/api/post/top-commented/").then(
          (res: any) => {
            this.res = res

            this.topCommented = res.top_commented_posts
            console.log(res)
            this.requestService.getWithoutAccess(this.requestService.base + "/api/post/stat/").then(
              (res: any) => {
                this.res = res
                this.stat = res
                console.log(res)
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
    this.initForm2()
  }


  loadView(id: number) {
    this.active = id
  }

  allowLike(postDetail: any) {
    if (this.auth) {
      if (!postDetail.disliked) {
        if (postDetail.liked) {
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

  allowDisLike(postDetail: any) {
    if (this.auth) {
      if (!postDetail.liked) {
        if (postDetail.disliked) {
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

  allowStar(postDetail: any) {
    if (this.auth) {
      if (this.isLinguist()) {
        if (postDetail.stared) {
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

  loadPost(id: number, view: number) {
    console.log(id)
    this.postView = id
    this.loading = true
    let url = ""
    if (this.authService.hasAuthData()) {
      url = this.requestService.base + "/api/post/with-access"
      this.requestService.getWithAccess(url, id).then(
        (res: any) => {
          this.postDetail = res
          this.loadView(view)
          this.loading = false
          console.log(res)
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    } else {
      url = this.requestService.base + "/api/post/"
      this.requestService.getWithoutAccess(url + id + "/").then(
        (res: any) => {
          this.postDetail = res
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
    // this.loading = true;
    const comment = this.formForm.get('comment')?.value;
    console.log(comment)
    let data = { "content": comment }
    console.log(comment)
    this.loading = true
    this.requestService.postWithAccess(this.requestService.base + "/api/post/comment/" + this.postDetail.post.id + "/", data).then(
      (res: any) => {
        this.loadPost(this.postDetail.post.id, 2)
        let data = {
          comment: ""
        }
        this.formForm.setValue(data)
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
    this.requestService.postWithAccess(this.requestService.base + "//api/dico/post/vote/" + id + "/", data).then(
      (res: any) => {
        console.log(res)

        this.requestService.getWithAccess(this.requestService.base + "//api/dico/post", id).then(
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
    this.requestService.postWithAccess(this.requestService.base + "/api/post/vote/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadPost(id, view)
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
    this.requestService.postWithAccess(this.requestService.base + "/api/post/dislike/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadPost(id, view)
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
    this.requestService.postWithAccess(this.requestService.base + "/api/post/star/" + id + "/", data).then(
      (res: any) => {
        console.log(res)
        this.loadPost(id, view)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }

  onDeletePost(id: number, view: number) {
    console.log(id)
    let data = {}
    this.loading = true
    this.requestService.delete(this.requestService.base + "/api/post/" + id + "/").then(
      (res: any) => {
        console.log(res)
        this.loadView(view)
        this.loadData()
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }
  onDeleteComment(id: number, idPost: number, view: number) {
    console.log(id)
    let data = {}
    this.loading = true
    this.requestService.delete(this.requestService.base + "/api/post/comment/" + id + "/").then(
      (res: any) => {
        console.log(res)
        this.loadPost(idPost, view)
      }, (err: any) => {
        this.loading = false
        console.log(err)
      }
    )
  }
}
