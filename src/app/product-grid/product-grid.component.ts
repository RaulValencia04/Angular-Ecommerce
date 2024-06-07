import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import Swal from 'sweetalert2';
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { interval } from 'rxjs';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {
  categories: string[] = [];
  categories2: number[] = [];
  productos: any[] = [];
  subasta: any[] = [];
  inputValue = '';
  showModal = false;
  isVenta = true;
  categorias: any[] = [];
  id_categoria: number = 0;
  productosEstado: any[] = [];
  subastaCerrada: boolean = false;
  operacionRealizada: boolean = false;

  username: string = "";
  hasUser: boolean = false;

  constructor(public userService: UsersService, private router: Router, private cookieService: CookieService) {}

  checkUser(): void {
    const userCookie = this.cookieService.get("user");
    if (userCookie) {
      this.username = userCookie;
      this.hasUser = true;
    }
  }

  isLoggedIn(): boolean {
    return this.cookieService.check("user");
  }

  toggleModo(): void {
    this.isVenta = !this.isVenta;
    this.buscarProducto('');
  }

  ngOnInit(): void {
    this.userService.GetSubastasOpen().subscribe(
      (data: any) => {
        if (data) {
          this.productosEstado = data;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    interval(1000).subscribe(() => {
      this.subasta.forEach((producto: any) => {
        this.calcularTiempoRestante(producto);
      });
    });

    const userCookie = this.cookieService.get("user");

    this.loadInitialData();

    const userData = this.cookieService.get("user");
    if (!userData || userData.trim() === '') {
      this.showModal = true;
    }

    this.userService.obtenerListCategorias().subscribe(
      (data: any) => {
        if (data) {
          this.categorias = data;
        } else {
          console.log("si llega aqui inserto datos");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadInitialData(): void {
    this.buscarProducto('');
  }

  mostrarAlerta() {
    Swal.fire({
      title: 'Producto agregado al carrito',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }

  addCategory(newCategory1?: string, newCategory2?: number): void {
    if (newCategory1 !== undefined && newCategory1.trim() !== "" && newCategory2 !== undefined && newCategory2 > 0) {
      this.categories.unshift(newCategory1);
      this.categories2.unshift(newCategory2);
      this.buscarProducto(newCategory1, newCategory2);
    } else if (newCategory1 !== undefined && newCategory1.trim() !== "") {
      this.categories.unshift(newCategory1);
      this.buscarProducto(newCategory1, newCategory2);
    } else if (newCategory2 !== undefined && newCategory2 > 0) {
      this.categories2.unshift(newCategory2);
      this.buscarProducto(newCategory1, newCategory2);
    }
  }

  buscarProducto(query?: string, query2?: number): void {
    if (query !== undefined && query.trim() !== "" && query2 !== undefined && query2 > 0) {
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });
      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });
    } else if (query !== undefined && query.trim() !== "") {
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });
      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });
    } else if (query2 !== undefined && query2 > 0) {
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });
      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });
    } else {
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });
      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });
    }
  }

  toggleVentaSubasta(): void {
    this.isVenta = !this.isVenta;
    this.buscarProducto('');
  }

  agregarAlCarrito(producto: any) {
    const idProducto = producto.idProducto;
    const userData = this.cookieService.get("user");
  
    const userObject = JSON.parse(userData);
    const idUsuario = userObject.idUsuario;
  
    const cantidad = producto.cantidad || 1;
  
    const data = {
      usuario: {
        idUsuario: idUsuario
      },
      producto: {
        idProducto: idProducto
      },
      cantidad: cantidad,
      fechaAgregado: new Date().toISOString() // Agrega la fecha actual
    };
    // console.log(data);
  
    this.userService.AgregarCarrito(data).subscribe(
      (response: any) => {
        console.log(`Producto "${producto.nombre}" agregado al carrito.`);
      },
      (error) => {
        console.error('Error al agregar el producto al carrito:', error);
      }
    );
  }
  
  

  calcularTiempoRestante(producto: any) {
    const fechaFinalSubasta = new Date(producto.fecha_final);
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
  }

  onTiempoRestanteCero(producto: any) {
    localStorage.setItem('subastaCerrada', 'true');
    this.userService.actualizarEstadoSubasta(producto.idProducto);
  }
}
