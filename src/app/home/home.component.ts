import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router"; // Importa el Router
import { CookieService } from "ngx-cookie-service"; // Importa CookieService

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
    public userService: UsersService,
    private router: Router, // Inyecta el Router
    private cookieService: CookieService // Inyecta CookieService
  ) {}

  ngOnInit() {
    // Verifica si la cookie "user" existe
    const userCookieExists = this.cookieService.check("user");

    if (!userCookieExists) {
      // Si la cookie no existe, redirige a la página de inicio de sesión
      this.router.navigateByUrl("/login");
    } else {
      // Si la cookie existe, obtén el usuario
      this.getUserLogged();
    }
  }
  logout() {
    // Borra la cookie
    this.cookieService.delete("user"); // Reemplaza "user" con el nombre de tu cookie

    // Redirige al usuario a la página de inicio de sesión (login)
    this.router.navigateByUrl("/login");
  }
  getUserLogged() {
    this.userService.getUser().subscribe((user) => {
      console.log(user);
    });
  }
}

