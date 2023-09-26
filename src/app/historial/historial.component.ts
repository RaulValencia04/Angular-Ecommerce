import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";


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


    //vamos a traer las subastas que este abiertas
    this.userService.obtenersubastasAbiertas().subscribe(
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
    this.userService.obtenersubastasCerradas().subscribe(
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

      const user = this.getIdUsuarioFromCookie();

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




}
