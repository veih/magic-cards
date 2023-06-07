import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) {}

  getWebsiteData() {
    return this.http.get(`https://api.magicthegathering.io/v1/cards`);
    
  }
}
