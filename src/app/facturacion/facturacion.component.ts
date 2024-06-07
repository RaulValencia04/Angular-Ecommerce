import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  factura: any[] = [];
  vali: boolean = true;
  facturaCargada: boolean = false; // Variable de control para evitar recargas múltiples

  constructor(
    public userService: UsersService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    if (!this.facturaCargada) { // Verifica si la factura ya fue cargada
      const user = this.getIdUsuarioFromCookie();

      this.userService.factura(user).subscribe(
        (data: any) => {
          if (data) {
            this.factura = data;
            this.facturaCargada = true; // Marca la factura como cargada
          } else {
            console.log("si llega aquí inserto datos");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  imprimirFactura() {
    window.print();
  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      return userObject.idUsuario || 1;
    }
    return 1;
  }

  deleteCompras() {
    const user = this.getIdUsuarioFromCookie();

    try {
      this.userService.EliminarPedido(user).subscribe(
        () => {
          this.router.navigateByUrl("/");
        },
        (error) => {
          console.error("Error al eliminar el carrito:", error);
        }
      );
    } catch (error) {
      console.log("Algo anda mal. " + error);
    }
  }

  mostrarAlerta() {
    Swal.fire({
      title: 'Compra finalizada :3',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
}
