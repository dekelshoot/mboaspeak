import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  headers: HttpHeaders = new HttpHeaders(
    {
      'Content-Type': 'application/json',
    }
  )
  constructor(private http: HttpClient) { }


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

  getAll(base: any) {
    return new Promise((resolve, reject) => {
      this.http.get(base).subscribe(
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



  //mettre ajour les informations dans la bd
  update(base: any, id: any, data: any) {
    return this.http.put(`${base}/${id}`, data);
  }

  //supprimer les informations dans la bd
  delete(base: any, id: any) {
    return this.http.delete(`${base}/${id}`);
  }
  deleteAll(base: any) {
    return this.http.delete(base);
  }
}
