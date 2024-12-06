import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  headers: HttpHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
    }
  )
  constructor(private http: HttpClient, private authService: AuthService) { }


  //////////////////////// CRUD/////////////////////////////

  //recuper les informations de la bd
  get(base: any, id: any) {
    return new Promise((resolve, reject) => {
      this.http.get(`${base}/${id}`, { headers: this.headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }

  //recuper les informations de la bd
  getWithAccess(base: any, id: any) {
    let token = this.authService.getAccessToken()
    const headers = this.headers.set('Authorization', `Bearer ${token}`);
    return new Promise((resolve, reject) => {
      this.http.get(`${base}/${id}/`, { headers: headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }

  getAll(base: any) {
    let token = this.authService.getAccessToken()
    const headers = this.headers.set('Authorization', `Bearer ${token}`);
    return new Promise((resolve, reject) => {
      this.http.get(base, { headers: headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })

  }

  getAll2(base: any) {
    const headers = this.headers
    return new Promise((resolve, reject) => {
      this.http.get(base, { headers: headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })

  }


  getWithoutAccess(base: any) {
    return new Promise((resolve, reject) => {
      this.http.get(base, { headers: this.headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })

  }


  //inserer les informations dans la bd
  postWithAccess(base: any, data: any) {
    let token = this.authService.getAccessToken()
    const headers = this.headers.set('Authorization', `Bearer ${token}`);
    return new Promise((resolve, reject) => {
      this.http.post(base, data, { headers: headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }
  //inserer les informations dans la bd
  post(base: any, data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(base, data, { headers: this.headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }

  //inserer les informations dans la bd
  postWithoutData(base: any) {
    return new Promise((resolve, reject) => {
      this.http.post(base, { headers: this.headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }



  //update les informations dans la bd
  update(base: any, id: any, data: any) {
    let token = this.authService.getAccessToken()
    const headers = this.headers.set('Authorization', `Bearer ${token}`);
    return new Promise((resolve, reject) => {
      this.http.put(`${base}/${id}/`, data, { headers: headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }

  //update les informations dans la bd
  updatePartial(base: any, id: any, data: any) {
    let token = this.authService.getAccessToken()
    const headers = this.headers.set('Authorization', `Bearer ${token}`);
    return new Promise((resolve, reject) => {
      this.http.patch(`${base}/${id}/`, data, { headers: headers }).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }

  //supprimer les informations dans la bd
  delete(base: any, id: any) {
    return this.http.delete(`${base}/${id}`);
  }
  deleteAll(base: any) {
    return this.http.delete(base);
  }
}
