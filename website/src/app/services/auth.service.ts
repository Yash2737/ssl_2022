import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
url:string = '';
  constructor(private http:HttpClient) {
    this.url = environment.applicationURL;
  }

  getUsers() {
    return this.http.get(this.url+'/ssl/registerations');
  }
  addUser(formData:any) {
    return this.http.post(this.url+'/ssl/register', formData);
  }

  //generate excel

}
