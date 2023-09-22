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

    

  }


  constructor(public userService: UsersService, private router: Router, private http: HttpClient ,private cookieService: CookieService) {}




}
