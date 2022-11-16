import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
    
  }

  scrollTo(page,e) {
    e.preventDefault();
    document.querySelector(page).scrollIntoView({
        behavior: 'smooth',
        offsetTop: 1 - 60,
    });
  }

  redirectTo(page) {
    this.router.navigate([page])
  }

}
