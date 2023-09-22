import { Component, OnInit, Query } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ofertar',
  templateUrl: './ofertar.component.html',
  styleUrls: ['./ofertar.component.css']
})
export class OfertarComponent implements OnInit{
  productos: any[] = [];

  ngOnInit() {


    let query = "";
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



    constructor(public userService: UsersService, private router: Router, private http: HttpClient ,private route: ActivatedRoute) {}

}
