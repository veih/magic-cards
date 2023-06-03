import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from './../services/http-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public websiteData: any;

  constructor(private httpService: HttpServiceService) {}

  ngOnInit() {}

  getData() {
    this.httpService.getWebsiteData().subscribe(data => {
      
      this.websiteData = data;
console.log(this.websiteData.name)
    });
  }
}
