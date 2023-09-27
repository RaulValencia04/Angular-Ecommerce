import { Component, NgModule, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { CookieService } from "ngx-cookie-service"; // Importa el servicio de cookies
import { Router } from "@angular/router";
import { RouterModule } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit{
  productos: any[] = [];
  productos2: any[] = [];
  username: string = "";
  hasUser: boolean = false; // Variable para verificar si existe un usuario en las cookies

  constructor(
    private userService: UsersService,
    private cookieService: CookieService, // Inyecta el servicio de cookies
    private router: Router // Inyecta el servicio de enrutamiento
  ) {}



  generateOfertarURL(id_producto: number) {

     this.router.navigateByUrl(`/ofertar/${id_producto}`);

  }

  ngOnInit(): void {
    this.loadProductos();
    this.checkUser(); // Verifica si existe un usuario al cargar el componente
  }

  loadProductos(): void {
    // Llama a la función del servicio para cargar los producto
    const limite =3
    this.userService.buscarProducto(limite, 0).subscribe((response: any) => {
      this.productos = response;
    });
    this.userService.buscarSubasta2(limite).subscribe((response: any) => {
      this.productos2 = response;

    });
  }
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
