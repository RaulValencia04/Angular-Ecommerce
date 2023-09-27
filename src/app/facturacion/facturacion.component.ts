import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  factura: any[] = [];
  vali: boolean = true;

  constructor(
    public userService: UsersService,
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Verificar si se debe realizar la recarga
    // if (this.vali) {
    //   // Establecer vali a falso para evitar futuras recargas
    //   this.vali = false;

    //   // Recargar la página actual
    //   window.location.reload();
    // }

    const user = this.getIdUsuarioFromCookie();

    this.userService.factura(user).subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.factura = data;
        } else {
          console.log("si llega aquí inserto datos");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  imprimirFactura() {
    window.print();
  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      return userObject.id_usuario || 1;
    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }

  deleteCompras() {
    const user = this.getIdUsuarioFromCookie();

    try {
      this.userService.EliminarPedido(user).subscribe(
        () => {
          // const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
          // this.loadCarritoProductos(idUsuarioFromCookie);
        },
        (error) => {
          console.error("Error al eliminar el carrito:", error);
        }
      );
      this.router.navigateByUrl("/");
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
