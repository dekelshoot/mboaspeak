import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  active = 1
  loading = false
  languages: Array<string> = ["english", "french", "camfranglais", "pidgin"]

  post_edit!: any
  posts: any = []
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
    this.loadpost();
  }

  initForm() {
    this.formForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      language: ['', [Validators.required]],
    });
  }


  loadpost() {
    this.loading = true
    this.requestService.getAll("http://127.0.0.1:8000/api/post/").then(
      (res: any) => {
        this.posts = res.posts
        console.log(this.posts)
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

    this.requestService.getWithAccess("http://127.0.0.1:8000/api/post", id).then(
      (res: any) => {
        this.post_edit = res
        console.log(this.post_edit)
        this.loading = false;
        this.loadView(3)
        this.initForm()
        let data = {
          title: res.post.title,
          content: res.post.content,
          language: res.post.language,
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

    const title = this.formForm.get('title')?.value;
    const content = this.formForm.get('content')?.value;
    const language = this.formForm.get('language')?.value;


    if (this.authService.hasAuthData()) {
      let data = {
        "title": title,
        "content": content,
        "language": language
      }
      console.log(data)
      this.requestService.postWithAccess("http://127.0.0.1:8000/api/post/", data).then(
        (res: any) => {
          this.loadView(1)
          this.loadpost()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }

  ngOnSubmitEdit() {
    this.loading = true;

    const title = this.formForm.get('title')?.value;
    const content = this.formForm.get('content')?.value;
    const language = this.formForm.get('language')?.value;



    if (this.authService.hasAuthData()) {
      let data = {
        "title": title,
        "content": content,
        "language": language

      }
      console.log(data)
      this.requestService.update("http://127.0.0.1:8000/api/post/update", this.post_edit.id, data).then(
        (res: any) => {
          this.loadView(1)
          this.loadpost()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }
}
