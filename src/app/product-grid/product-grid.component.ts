import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import Swal from 'sweetalert2';
import { CookieService } from "ngx-cookie-service"; // Importa el servicio de cookies
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


  constructor(public userService: UsersService,private router: Router, private cookieService: CookieService) {} // Inyecta el servicio de cookies

 checkUser(): void {
    const userCookie = this.cookieService.get("user"); // Obtiene el valor de la cookie "user"
    if (userCookie) {
      this.username = userCookie; // Establece el nombre de usuario si existe
      this.hasUser = true; // Indica que existe un usuario en las cookies
    }
  }

  isLoggedIn(): boolean {
    return this.cookieService.check("user"); // Devuelve true si la cookie "user" existe
  }

  toggleModo(): void {
    this.isVenta = !this.isVenta;
    this.buscarProducto(''); // Realizar una nueva búsqueda al cambiar el modo
  }

  ngOnInit(): void {



    this.userService.GetSubastasOpen().subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.productosEstado = data;
        }
      },
      (error) => {
        console.log(error);
      }
    );

    interval(1000)
    .subscribe(() => {
      this.subasta.forEach((producto: any) => {
        this.calcularTiempoRestante(producto);
      });
    });



    const userCookie = this.cookieService.get("user");




    this.loadInitialData();

    const userData = this.cookieService.get("user");
    if (!userData || userData.trim() === '') {
      // El usuario no ha iniciado sesión, muestra el modal
      this.showModal = true;
    }


    //traer las categorias para el filtro
    this.userService.obtenerListCategorias().subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
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

  // ngOnDestroy() {
  //   this.onDestroy$.next(); // Liberar recursos cuando el componente se destruye
  //   this.onDestroy$.complete();
  // }


  loadInitialData(): void {
    this.buscarProducto('');
  }

  mostrarAlerta() {
    Swal.fire({
      title: 'Producto agregado al carrito',
      icon: 'success', // Puedes cambiar el ícono a tu gusto (success, error, warning, etc.)
      timer: 1500, // Tiempo de visualización en milisegundos (2 segundos)
      showConfirmButton: false // Oculta el botón de confirmación
    });
  }


  addCategory(newCategory1?: string, newCategory2?: number): void {
    if (newCategory1 !== undefined && newCategory1.trim() !== "" &&  newCategory2 !== undefined && newCategory2 > 0) {

        this.categories.unshift(newCategory1);

        this.categories2.unshift(newCategory2);
        this.buscarProducto(newCategory1, newCategory2);

    }else if (newCategory1 !== undefined && newCategory1.trim() !== ""){
      this.categories.unshift(newCategory1);
        this.buscarProducto(newCategory1, newCategory2);

    }else if (newCategory2 !== undefined && newCategory2 > 0){

        this.categories2.unshift(newCategory2);
        this.buscarProducto(newCategory1, newCategory2);
    }



    //console.log("Categorías actualizadas:", this.categories);
  }


  buscarProducto(query?: string, query2?: number): void {



    if (query !== undefined && query.trim() !== "" && query2 !== undefined && query2 > 0) {
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });



    }else if (query !== undefined && query.trim() !== ""){

      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });

    }else if (query2 !== undefined && query2 > 0){

      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });



    } else{

      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        this.subasta = response;
      });



    }





  }
  toggleVentaSubasta(): void {
    this.isVenta = !this.isVenta; // Cambiar entre Venta y Subasta
    this.buscarProducto(''); // Realizar una nueva búsqueda al cambiar de vista
  }

  agregarAlCarrito(producto: any) {
    // Obtener el id_producto desde el botón





    const id_producto = producto.id_producto;

    // Obtener el id_usuario desde la cookie "user"
    const userData = this.cookieService.get("user");

    // if (!userData || userData.trim() === '') {
    //   // Muestra el modal de inicio de sesión
    //   this.showModal = true;
    //   return; // No permite agregar al carrito si el usuario no ha iniciado sesión
    // }

    const userObject = JSON.parse(userData);
    const id_usuario = userObject.id_usuario;

    // Definir la cantidad (puedes ajustarla según tus necesidades)
    const cantidad = producto.cantidad || 1; // Por defecto, 1 si no se especifica cantidad

    const data = {
      id_usuario: id_usuario,
      id_producto: id_producto,
      Cantidad: cantidad
    };

    this.userService.AgregarCarrito(data).subscribe(
      (response: any) => {
        // La solicitud se ha completado con éxito
        console.log(`Producto "${producto.nombre}" agregado al carrito.`);
      },
      (error) => {
        // Ha ocurrido un error durante la solicitud
        console.error('Error al agregar el producto al carrito:', error);
      }
    );

  }

  calcularTiempoRestante(producto: any) {
    const fechaFinalSubasta = new Date(producto.fecha_final);
    const fechaActual = new Date();
    const diferencia = fechaFinalSubasta.getTime() - fechaActual.getTime();
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor(
      (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    //console.log( (diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    const tp = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
    // console.log(tp);

    if (diferencia <= 0 ) {
      this.onTiempoRestanteCero(producto);
      this.operacionRealizada = true;
      this.subastaCerrada = true;
      producto.tiempoRestante = 'Subasta Cerrada';
       // Marca la operación como realizada
    }

  }
  onTiempoRestanteCero(producto: any) {

        // console.log(this.estado2);
;

      // Marca la subasta como cerrada en el almacenamiento local
      localStorage.setItem('subastaCerrada', 'true');



      this.userService.ActualizarEstadoSubasta(producto.id_producto);



      // this.subastasCerradas[producto.id_producto] = true;//

  }


}
