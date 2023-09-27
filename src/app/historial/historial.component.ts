import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import Swal from 'sweetalert2';


@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})

export class HistorialComponent implements OnInit{
  SBabiertas: any[] = [];
  SBcerradas: any[] = [];
  SBcerradasG: any[] = [];



  ngOnInit() {

    const user = this.getIdUsuarioFromCookie();

    const userCookie = this.cookieService.get("user");


    if(!userCookie){
      console.log(userCookie);
      this.router.navigateByUrl("/");
    }    
  

    //vamos a traer las subastas que este abiertas
    this.userService.ObtenerSubastaActivosme(user).subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.SBabiertas = data;
        } else {
          console.log("si llega aqui inserto datos");
        }
      },
      (error) => {
        console.log(error);
      }
    );


    //vamos a traer las subastas que este cerradas
    this.userService.ObtenerSubastaCerradame(user).subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.SBcerradas = data;
        } else {
          console.log("si llega aqui inserto datos");
        }
      },
      (error) => {
        console.log(error);
      }
    );


    this.userService.ObtenerGanador(user).subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.SBcerradasG = data;
        } else {
          console.log("si llega aqui inserto datos");
        }
      },
      (error: any) => {
        console.log(error);
      }
    );



  }
  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.id_usuario || '';
    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }


  constructor(public userService: UsersService, private router: Router, private http: HttpClient ,private cookieService: CookieService) {}



  eliminarProducto(id_producto: number){
    this.userService.EliminarSubasta(id_producto).subscribe(
      () => {
        this.mostrarAlerta();
        window.location.reload();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }


  mostrarAlerta() {
    Swal.fire({
      title: 'Subasta Cancelada',
      icon: 'info', 
      timer: 2500, 
      showConfirmButton: false 
    });
  }
  mostrarAlertaSucces() {
    Swal.fire({
      title: 'Producto agregado al carrito',
      icon: 'success', // Puedes cambiar el ícono a tu gusto (success, error, warning, etc.)
      timer: 1500, // Tiempo de visualización en milisegundos (2 segundos)
      showConfirmButton: false // Oculta el botón de confirmación
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

  //  this.userService.ActualizarEstadoSubasta(producto.idProducto);

    this.userService.AgregarCarrito(data).subscribe(
      (response: any) => {
   this.userService.ActualizarUsuario(producto.id_producto);
       // La solicitud se ha completado con éxito

        console.log(`Producto "${producto.nombre}" agregado al carrito.`);
        window.location.reload();
      },
      (error) => {
        // Ha ocurrido un error durante la solicitud
        console.error('Error al agregar el producto al carrito:', error);
      }
    );
   
  }
}
