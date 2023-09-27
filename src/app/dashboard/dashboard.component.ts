import { Component, NgModule, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { CookieService } from "ngx-cookie-service"; // Importa el servicio de cookies
import { Router } from "@angular/router";
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';


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
  
  mostrarAlerta() {
    Swal.fire({
      title: 'Producto agregado al carrito',
      icon: 'success', // Puedes cambiar el ícono a tu gusto (success, error, warning, etc.)
      timer: 1500, // Tiempo de visualización en milisegundos (2 segundos)
      showConfirmButton: false // Oculta el botón de confirmación
    });
  }
  redirectToCart(): void {
    this.router.navigate(['/carrito']); // Cambia '/carrito' a la ruta de tu página de carrito
  }

}
