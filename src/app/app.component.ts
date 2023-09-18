import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{

  constructor(
    private router: Router,
    private cookieService: CookieService
  ){}
  ngOnInit() {

    // const userCookieExists = this.cookieService.check("user");

    // if (!userCookieExists) {
    //   // Si la cookie no existe, redirige a la página de inicio de sesión
    //   this.router.navigateByUrl("/login");
    // }
    // this.router.navigateByUrl("/dashboard");

  }


}
