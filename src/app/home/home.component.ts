import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from './../services/http-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public websiteData: any;
  public cardName: string | any;
  public filteredCards!: any[];

  constructor(private httpService: HttpServiceService) {}

  ngOnInit() {}

  getData() {
    this.httpService.getWebsiteData().subscribe((data: any) => {
      this.websiteData = data;
      this.filterCards();
    });
  }

  filterCards() {
    if (!this.cardName || this.cardName.trim() === '') {
      this.filteredCards = this.websiteData.cards;
    } else {
      this.filteredCards = this.websiteData.cards.filter((card: { name: string }) =>
        card.name.toLowerCase().includes(this.cardName.toLowerCase())
      );
    }
  }
}
