import { Component, Renderer2, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  public files: any = [];
  selectedFiles: File[] = [];

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    const script = this.renderer.createElement('script');
    script.src = 'assets/index.js';

    this.renderer.appendChild(document.head, script);
  }

  handleFileInput(event: any): void {
    this.selectedFiles = event.target.files;
    console.log('Arquivos selecionados:', this.selectedFiles);

    // Realize as operações de sistema de arquivos desejadas aqui, como leitura, gravação, etc.
  }
}
