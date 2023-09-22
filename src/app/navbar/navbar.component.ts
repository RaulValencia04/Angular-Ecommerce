import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { CookieService } from "ngx-cookie-service"; // Importa el servicio de cookies
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username: string = "";
  hasUser: boolean = false;

  constructor(
    private userService: UsersService,
    private cookieService: CookieService, // Inyecta el servicio de cookies
    private router: Router // Inyecta el servicio de enrutamiento
  ) {}

  checkUser(): void {
    const userCookie = this.cookieService.get("user"); // Obtiene el valor de la cookie "user"
    if (userCookie) {
      this.username = userCookie; // Establece el nombre de usuario si existe
      this.hasUser = true; // Indica que existe un usuario en las cookies
    }
  }
  isLoggedIn(): boolean {
    return this.cookieService.check("user"); // Devuelve true si la cookie "user" existe
  }

  // Función para obtener el nombre de usuario desde la cookie
  getUsername(): string {
    const userData = this.cookieService.get("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      return userObject.nombre_usuario || "";
    }
    return "";
  }
  logout() {
    // Borra la cookie
    this.cookieService.delete("user"); // Reemplaza "user" con el nombre de tu cookie


  }

  redirectToCart(): void {
    this.router.navigate(['/carrito']); // Cambia '/carrito' a la ruta de tu página de carrito
  }

}
