import { Component, OnInit, Query } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-ofertar',
  templateUrl: './ofertar.component.html',
  styleUrls: ['./ofertar.component.css']
})
export class OfertarComponent implements OnInit{
  productos: any[] = [];


  ngOnInit() {


    let query = "";
    // this.calcularTiempoRestante(this.productos);
    this.route.params.subscribe(params => {
      query = params['id']; // Obtiene el valor del parámetro "id"
      // Ahora puedes usar "id" en tu componente
      console.log(typeof query)

      const numeroEntero = parseInt(query, 10); // La base 10 es común para números enteros


      if (typeof numeroEntero === 'number') {
        this.userService.BuscarPorId(numeroEntero).subscribe((response: any) => {
          this.productos = response;
          console.log(this.productos);
        })
      }
    });





  }
  calcularTiempoRestante(producto: any) {
    const fechaFinalSubasta = new Date(producto.fecha_final);
    const fechaActual = new Date();

    // Calcula la diferencia de tiempo en milisegundos
    const diferencia = fechaFinalSubasta.getTime() - fechaActual.getTime();

    // Convierte la diferencia de tiempo a días, horas, minutos y segundos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    // Formatea el tiempo restante
    return producto.tiempoRestante = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    console.log( producto.tiempoRestante)
  }


  OFERTAR(producto: any) {
    const precioOfertado = producto.newprecios; // Obtener el precio ingresado por el usuario
    const precioSubasta = producto.precio_subasta; // Obtener el precio de subasta del producto

    // Verificar si el precio ofertado es mayor al precio de subasta
    if (precioOfertado > precioSubasta) {
      // Realizar la oferta
      console.log(`Oferta aceptada: US $${precioOfertado}`);

      // Obtener el ID del producto y el ID del usuario
      const idProducto = producto.id_producto; // Reemplaza con el campo correcto
      const idUsuario = this.getIdUsuarioFromCookie(); // Reemplaza con el ID de usuario correcto

      // Llamar al método realizarPuja y pasar los parámetros
      this.userService.realizarPuja(idProducto, precioOfertado, idUsuario).subscribe(
        (response: any) => {
          console.log('Puja realizada con éxito:', response);
          // Realizar acciones adicionales si es necesario
        },
        (error) => {
          console.error('Error al realizar la puja:', error);
        }
      );

      // Aquí puedes agregar la lógica adicional necesaria después de realizar la puja.
    } else {
      // Mostrar un mensaje de error al usuario
      console.error('La oferta debe ser mayor al precio de subasta.');
      // Puedes mostrar un mensaje de error al usuario de alguna manera, como un mensaje en la interfaz de usuario.
    }
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


    constructor(public userService: UsersService, private router: Router, private http: HttpClient , private cookieService: CookieService,private route: ActivatedRoute) {}

}
