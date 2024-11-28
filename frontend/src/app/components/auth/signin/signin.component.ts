import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { RequestService } from 'src/app/services/request.service';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  formForm!: FormGroup;
  loadingData = false
  message: string = '';
  success = false;
  err = false;
  constructor(private requestService: RequestService,
    private formBuilder: FormBuilder, public routerService: RouterService
  ) { }
  ngOnInit(): void {
    console.log("hellohttp://127.0.0.1:8000/api/auth/login/")
    this.initForm();
  }

  initForm() {
    this.formForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnSubmit() {
    this.loadingData = true;
    this.success = false
    this.err = false
    const username = this.formForm.get('username')?.value;
    const password = this.formForm.get('password')?.value;

    let data = {
      "username": username,
      "password": password,
    }

    console.log(data)

    this.requestService.post("http://127.0.0.1:8000/api/auth/login/", data).then(
      (response: any) => {
        console.log(response)
        this.message = `Wellcome back ${response.username} `
        this.loadingData = false
        this.success = true
        this.err = false
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        console.log('Login successful!', response);
        setTimeout(() => {
          this.routerService.routeRoute("/apps")
        }, 2000)
      }, (reason: any) => {
        this.loadingData = false
        this.message = "Login failed"
        this.success = false
        this.err = true
        console.log(reason)
      }
    )
  }


}
