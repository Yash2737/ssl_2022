import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SslClient';

  constructor(private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    router.events.subscribe((route) => {
      if (route instanceof NavigationEnd) {
        console.log(route.url);
        if(router.url === '/home') {
          this.document.body.classList.add('w-fit-content');   
        }
        else {
          this.document.body.classList.remove('w-fit-content');   
          this.document.body.classList.add('w-unset');   
        }
      }
    });
    // this.document.body.classList.add('abc');
  }


}
