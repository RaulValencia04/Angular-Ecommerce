import { CookieService } from "ngx-cookie-service";
import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  productos: any[] = [];

  constructor(public userService: UsersService,private cookieService: CookieService,) {}

  ngOnInit(): void {
    // Obtener el id_usuario de la cookie del usuario (debes implementar esto)
    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();

    // Cargar productos del carrito basados en el id_usuario
    this.loadCarritoProductos(idUsuarioFromCookie);
  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.id_usuario || "";

    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }

  eliminarProducto(id_carrito: number) {
    try {
        this.userService.EliminarCarrito(id_carrito).subscribe(
            () => {
                const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
                this.loadCarritoProductos(idUsuarioFromCookie);
            },
            (error) => {
                console.error('Error al eliminar el carrito:', error);
            }
        );
    } catch (error) {
        console.error('Error inesperado al eliminar el carrito:', error);
    } finally {
      // Refrescar la página actual
      window.location.reload();

    }
}





  loadCarritoProductos(idUsuario: number): void {
    this.userService.ObtenerCarrito(idUsuario).subscribe((response: any) => {
      // console.log(response); // Agrega esta línea para depurar la respuesta

      // Asignar los resultados a la variable productos
      this.productos = response;
    });
  }
}

