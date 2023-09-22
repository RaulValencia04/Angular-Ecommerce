import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { CookieService } from "ngx-cookie-service"; // Importa el servicio de cookies

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {
  categories: string[] = [];
  productos: any[] = [];
  inputValue = '';
  showModal = false;

  constructor(public userService: UsersService, private cookieService: CookieService) {} // Inyecta el servicio de cookies

  ngOnInit(): void {
    this.loadInitialData();

    const userData = this.cookieService.get("user");
    if (!userData || userData.trim() === '') {
      // El usuario no ha iniciado sesión, muestra el modal
      this.showModal = true;
    }



  }

  loadInitialData(): void {
    this.buscarProducto('');
  }

  addCategory(newCategory: string): void {
    if (!this.categories.includes(newCategory)) {
      this.categories.unshift(newCategory);
      this.buscarProducto(newCategory);
    }
  }

  buscarProducto(query: string): void {
    query = query.trim();
    console.log("Búsqueda realizada: " + query);

    this.userService.buscarProducto(query).subscribe((response: any) => {
      console.log(response);
      this.productos = response;
    });
  }

  agregarAlCarrito(producto: any) {
    // Obtener el id_producto desde el botón





    const id_producto = producto.id_producto;

    // Obtener el id_usuario desde la cookie "user"
    const userData = this.cookieService.get("user");

    // if (!userData || userData.trim() === '') {
    //   // Muestra el modal de inicio de sesión
    //   this.showModal = true;
    //   return; // No permite agregar al carrito si el usuario no ha iniciado sesión
    // }

    const userObject = JSON.parse(userData);
    const id_usuario = userObject.id_usuario;

    // Definir la cantidad (puedes ajustarla según tus necesidades)
    const cantidad = producto.cantidad || 1; // Por defecto, 1 si no se especifica cantidad

    const data = {
      id_usuario: id_usuario,
      id_producto: id_producto,
      Cantidad: cantidad
    };

    this.userService.AgregarCarrito(data).subscribe(
      (response: any) => {
        // La solicitud se ha completado con éxito
        console.log(`Producto "${producto.nombre}" agregado al carrito.`);
      },
      (error) => {
        // Ha ocurrido un error durante la solicitud
        console.error('Error al agregar el producto al carrito:', error);
      }
    );
  }


}
