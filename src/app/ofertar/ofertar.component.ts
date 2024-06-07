import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

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
      console.log(numeroEntero);

      if (!isNaN(numeroEntero)) {
        this.idProducto = numeroEntero;
        this.cargarProducto(this.idProducto);
      } else {
        console.error('El parámetro id no es un número válido');
      }
    });

    setInterval(() => {
      if (this.estado2 === 0) {
        this.calcularTiempoRestante(this.productos[0]);
      }
    }, 1000);
  }

  cargarProducto(id: number) {
    this.userService.BuscarPorId(id).subscribe(
      (response: any) => {
        if (response) {
          this.productos = [response];
          this.estado2 = response.estado || 0;
          this.subastasCerradas[id] = response.estado === 1;
        }
      },
      (error) => {
        console.error('Error al buscar por ID:', error);
      }
    );
  }

  OFERTAR(producto: any) {
    const idUsuarioCookie = this.getIdUsuarioFromCookie();

    if (!this.subastaCerrada && this.estado2 == 0 && idUsuarioCookie !== producto.idUsuario) {
      const precioOfertado = producto.newprecios;
      const precioSubasta = producto.precioSubasta;

      if (precioOfertado > precioSubasta) {
        const idProducto = producto.idProducto;
        const idUsuario = this.getIdUsuarioFromCookie();

        this.userService.realizarPuja(idProducto, precioOfertado, idUsuario).subscribe(
          (response: any) => {
             window.location.reload();
          },
          (error) => {
            console.error('Error al realizar la puja:', error);
          }
        );
      } else {
        this.mostrarAlerta2();
        console.error('La oferta debe ser mayor al precio de subasta.');
        
      }
    } else {
      console.error('No puedes pujar en esta subasta.');
      this.mostrarAlerta();
    }
  }

  mostrarAlerta() {
    Swal.fire({
      title: 'No puedes ofertar en tus subastas',
      icon: 'error',
      timer: 2500,
      showConfirmButton: false
    });
  }
  mostrarAlerta2() {
    Swal.fire({
      title: 'La oferta debe ser mayor al precio de subasta.',
      icon: 'error',
      timer: 2500,
      showConfirmButton: false
    });
  }

  calcularTiempoRestante(producto: any) {
    const fechaFinalSubasta = new Date(producto.fechaFinal);
    const fechaActual = new Date();
    const diferencia = fechaFinalSubasta.getTime() - fechaActual.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    const tp = `${dias}d ${horas}h ${minutos}m ${segundos}s`;

    if (diferencia <= 0) {
      this.onTiempoRestanteCero(producto);
      this.operacionRealizada = true;
      this.subastaCerrada = true;
      producto.tiempoRestante = 'Subasta Cerrada';
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
    if (!this.subastasCerradas[producto.idProducto] && this.estado2 == 0) {
      console.log(this.estado2);
      const idUsuario = this.getIdUsuarioFromCookie();
      const dir = this.getdir();

      localStorage.setItem('subastaCerrada', 'true');

      const pedido = {
        total_pagar: producto.precio_subasta,
        fecha_pedido: new Date().toISOString(),
        id_estado_pedido: 1,
        id_usuario: idUsuario,
        ubicacion: dir,
      };

      this.userService.actualizarEstadoSubasta(producto.idProducto).subscribe(
        (response: any) => {
          console.log('Estado de la subasta actualizado:', response);
        },
        (error) => {
          console.error('Error al actualizar el estado de la subasta:', error);
        }
      );

      this.subastasCerradas[producto.idProducto] = true;
    }
  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      return userObject.idUsuario || 1;
    }
    return 1;
  }
}
