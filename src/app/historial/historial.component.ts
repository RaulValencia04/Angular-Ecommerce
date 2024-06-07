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


    this.userService.obtenerGanador(user).subscribe(
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
      return userObject.idUsuario || '';
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
    const idProducto = producto.idProducto;
    const userData = this.cookieService.get('user');
  
    const userObject = JSON.parse(userData);
    const idUsuario = userObject.idUsuario;
  
    const cantidad = producto.cantidad || 1;
  
    const data = {
      usuario: {
        idUsuario: idUsuario
      },
      producto: {
        idProducto: idProducto
      },
      cantidad: cantidad,
      fechaAgregado: new Date().toISOString() // Agrega la fecha actual
    };
  
    this.userService.AgregarCarrito(data).subscribe(
      (response: any) => {
        this.mostrarAlerta();
        console.log(`Producto "${producto.nombre}" agregado al carrito.`);
      },
      (error) => {
        console.error('Error al agregar el producto al carrito:', error);
      }
    );
  }

}
