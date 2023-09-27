import { Component , OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

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
  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.id_usuario || '';
    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }



}
