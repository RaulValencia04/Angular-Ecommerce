import { Component , OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent {
  factura:any[] = []

  constructor(public userService: UsersService, private router: Router, private http: HttpClient ,private cookieService: CookieService) {}

  ngOnInit(): void {


    const user = this.getIdUsuarioFromCookie();

    this.userService.factura(user).subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.factura = data;
        } else {
          console.log("si llega aqui inserto datos");
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
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.id_usuario || '';
    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }
  deleteCompras(){
    const user = this.getIdUsuarioFromCookie();



    try {
      this.userService.EliminarPedido(user).subscribe(
        () => {
          // const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
          // this.loadCarritoProductos(idUsuarioFromCookie);
        },
        (error) => {
          console.error('Error al eliminar el carrito:', error);
        }
      );
      this.router.navigateByUrl("/");

    } catch (error) {
       console.log("algo anda mal. "+error)

    }




  }
  mostrarAlerta() {
    Swal.fire({
      title: 'Compra finalizada :3',
      icon: 'success', // Puedes cambiar el ícono a tu gusto (success, error, warning, etc.)
      timer: 1500, // Tiempo de visualización en milisegundos (2 segundos)
      showConfirmButton: false // Oculta el botón de confirmación
    });
  }

}
