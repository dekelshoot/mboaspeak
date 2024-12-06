import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
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
  authDataExists: boolean = false;
  constructor(private requestService: RequestService,
    private formBuilder: FormBuilder, public routerService: RouterService, private authService: AuthService
  ) { }
  ngOnInit(): void {
    // const authData = localStorage.getItem('authData');
    // if (this.authService.hasAuthData()) {
    //   this.routerService.routeRoute("/apps")
    // }
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



        // Sauvegarder les données
        this.authService.saveAuthData({
          ...response
        });


        console.log('Login successful! Data stored in localStorage:', this.authService.getAuthData());

        setTimeout(() => {
          this.routerService.routeRoute("/dashboard")
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
