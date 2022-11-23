import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url: string = '';
  constructor(private http: HttpClient) {
    this.url = environment.applicationURL;
  }

  getUsers() {
    return this.http.get(this.url + '/ssl/registerations');
  }

  getDash() {
    return this.http.get(this.url + '/ssl/dashboard');
  }

  addUser(formData: any) {
    return this.http.post(this.url + '/ssl/register', formData);
  }

  removePlayer(id) {
    return this.http.post(this.url + '/ssl/removePlayer', { id });
  }

  updateSevaReceived(value:string)
  {
    return this.http.post(this.url + '/ssl/updateSevaReceived', value);

  }

  //generate excel

}
