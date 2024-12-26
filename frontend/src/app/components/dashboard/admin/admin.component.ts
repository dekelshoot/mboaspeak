import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  active = 1
  loading = false

  admin!: any
  linguist!: any
  contributor!: any
  user_types: Array<string> = ["admin", 'linguist', 'contributor']

  formForm!: FormGroup;

  constructor(public requestService: RequestService, private formBuilder: FormBuilder, private routerService: RouterService,
    private authService: AuthService
  ) { }
  ngOnInit(): void {

    const authData = localStorage.getItem('authData');
    if (!this.authService.hasAuthData()) {
      this.routerService.routeRoute("/auth/sign-in")
    }
    this.loadUser()

  }

  initForm() {
    this.formForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      user_type: ['', [Validators.required]],
    });
  }

  loadView(id: number) {
    this.active = id
    if (id == 2) {
      this.initForm()
    }

  }

  editRole(username: string, user_type: string) {
    console.log(username)

    this.loadView(2)
    this.initForm()
    let data = {
      username: username,
      user_type: user_type,
    }
    this.formForm.setValue(data)

  }

  loadUser() {
    this.loading = true
    this.requestService.getAll(this.requestService.base + "/api/admin/users/?user_type=admin").then(
      (res: any) => {
        this.admin = res.users
        console.log(this.admin)
        this.requestService.getAll(this.requestService.base + "/api/admin/users/?user_type=linguist").then(
          (res: any) => {
            this.linguist = res.users
            console.log(this.linguist)
            this.loading = false;

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

  ngOnSubmit() {
    this.loading = true;

    const username = this.formForm.get('username')?.value;
    const user_type = this.formForm.get('user_type')?.value;

    if (this.authService.hasAuthData()) {
      let data = {
        "user_type": user_type,
      }
      console.log(data)
      this.requestService.updatePartial(this.requestService.base + "/api/admin/update-user-type", username, data).then(
        (res: any) => {
          this.loadView(1)
          this.loadUser()
        }, (err: any) => {
          this.loading = false
          console.log(err)
        }
      )
    }

  }


}
