import { Component } from '@angular/core';
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-add-productos',
  templateUrl: './add-productos.component.html',
  styleUrls: ['./add-productos.component.css']
})


export class AddProductosComponent {
    nombre: string = "";
    precio: number = 0.0;
    precio_subasta: number = 0.0;
    imagen_url: string = "";
    descripcion: string = "";
    id_categoria: number = 0;
    estado: string = "";
    fecha_inicio: Date = new Date();
    fecha_final: Date = new Date();
    tipo_producto: string = "";



  constructor(public userService: UsersService, private router: Router) {}

  guardarProducto() {
    const user = { nombre: this.nombre , 
      precio: this.precio, 
      precioSubasta: this.precio_subasta,
      imagen_url: this.imagen_url,
      descripcion: this.descripcion,
      id_categoria: this.id_categoria,
      estado: this.estado,
      fecha_inicio: this.fecha_inicio,
      fecha_final: this.fecha_inicio,
      tipo_producto: this.tipo_producto
    };


    console.log(user);
  }
}
