import { Component , OnInit } from "@angular/core";
import { UsersService } from "../users/users.service"
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  productos: any[] = [];

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    // Llama a la función del servicio para cargar los producto
    const limite =3
    this.userService.buscarProducto(limite).subscribe((response: any) => {
      this.productos = response;
    });
  }

}
