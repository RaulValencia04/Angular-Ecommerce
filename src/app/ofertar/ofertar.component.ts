import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-ofertar',
  templateUrl: './ofertar.component.html',
  styleUrls: ['./ofertar.component.css'],
})
export class OfertarComponent implements OnInit {
  productos: any[] = [];
  subastaCerrada: boolean = false;
  operacionRealizada: boolean = false;
  idProducto: number = 0;
  estado2: any = 1;
  subastasCerradas: { [idProducto: number]: boolean } = {};


  constructor(
    public userService: UsersService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.route.params.subscribe((params) => {
      const query = params['id'];
      const numeroEntero = parseInt(query, 10);

      if (typeof numeroEntero === 'number') {
        this.idProducto = numeroEntero;
        this.userService.BuscarPorId(this.idProducto).subscribe(
          (response: any) => {
            this.productos = response;
          }
        );
      }
    });

    this.userService.obtenerEstadoSubasta(this.idProducto).subscribe(
      (response: any) => {
        this.estado2 = response[0].estado ;
       console.log(this.estado2);



        // Almacenar el estado de cierre para esta subasta
        this.subastasCerradas[this.idProducto] = response[0].estado == 1;
      },
      (error) => {
        console.error('Error al obtener el estado de la subasta:', error);
      }
    );

    setInterval(() => {
      if (this.estado2 == 0) {
        this.calcularTiempoRestante(this.productos);
      }
    }, 1000);
  }
  OFERTAR(producto: any) {
    if (!this.subastaCerrada && this.estado2 == 0) {


      const precioOfertado = producto.newprecios;
      const precioSubasta = producto.precio_subasta;

      if (precioOfertado > precioSubasta) {
        const idProducto = producto.id_producto;
        const idUsuario = this.getIdUsuarioFromCookie();

        this.userService
          .realizarPuja(idProducto, precioOfertado, idUsuario)
          .subscribe(
            (response: any) => {
              // Realizar acciones adicionales si es necesario
              window.location.reload();
            },
            (error) => {
              console.error('Error al realizar la puja:', error);
            }
          );

      } else {
        console.error('La oferta debe ser mayor al precio de subasta.');
      }
    }
  }

  detenerContador(producto: any) {
    this.subastaCerrada = true;
    producto.tiempoRestante = 'Subasta Cerrada';
  }

  calcularTiempoRestante(producto: any) {
    const fechaFinalSubasta = new Date(producto.fecha_final);
    const fechaActual = new Date();
    const diferencia = fechaFinalSubasta.getTime() - fechaActual.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    //console.log( (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    const tp = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    // console.log(tp);

    if (diferencia <= 0 ) {
      this.onTiempoRestanteCero(producto);
      this.operacionRealizada = true;
      this.subastaCerrada = true;
      producto.tiempoRestante = 'Subasta Cerrada';
       // Marca la operación como realizada
    }

    return tp;
  }

  getdir(): string {
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      return userObject.direccion || '';
    }

    return '';
  }

  onTiempoRestanteCero(producto: any) {
    if (!this.subastasCerradas[producto.id_producto] && this.estado2 == 0) {
        console.log(this.estado2);
      const idUsuario = this.getIdUsuarioFromCookie();
      const dir = this.getdir();

      // Marca la subasta como cerrada en el almacenamiento local
      localStorage.setItem('subastaCerrada', 'true');

      const pedido = {
        total_pagar: producto.precio_subasta,
        fecha_pedido: new Date().toISOString(),
        id_estado_pedido: 1,
        id_usuario: idUsuario,
        ubicacion: dir,
      };

      this.userService.CrearPedido(pedido).subscribe(
        (response: any) => {
          const idPedido = response.id_pedido;
          const detallesPedido = [
            {
              id_producto: producto.id_producto,
              id_pedido: idPedido,
              cantidad: 1,
            },
          ];

          this.userService.AgregarDetalle(detallesPedido).subscribe(
            (detalleResponse: any) => {

                this.userService.ActualizarEstadoSubasta(producto.id_producto);
                this.detenerContador(producto);
                console.log(detallesPedido);

            },
            (detalleError: any) => {
              console.error(
                'Error al agregar el detalle de pedido:',
                detalleError
              );
            }
          );
        },
        (error) => {
          console.error('Error al crear el pedido:', error);
        }
      );
      this.subastasCerradas[producto.id_producto] = true;
    }
  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      return userObject.id_usuario || '';
    }

    return 1;
  }
}
