import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <!--<a routerLink="/auth/login">Login</a>
    <a routerLink="/auth/recover">Recover</a>-->
    <router-outlet></router-outlet>
  `
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
