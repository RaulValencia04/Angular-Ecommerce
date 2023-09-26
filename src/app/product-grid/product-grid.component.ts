import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import Swal from 'sweetalert2';
import { CookieService } from "ngx-cookie-service"; // Importa el servicio de cookies


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
  


  constructor(public userService: UsersService, private cookieService: CookieService) {} // Inyecta el servicio de cookies

  toggleModo(): void {
    this.isVenta = !this.isVenta;
    this.buscarProducto(''); // Realizar una nueva búsqueda al cambiar el modo
  }

  ngOnInit(): void {
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
        console.log("Los dos");
        console.log("Nueva categoría 1:", newCategory1);
        this.categories2.unshift(newCategory2);
        console.log("Nueva categoría 1:", newCategory2);
        this.buscarProducto(newCategory1, newCategory2);

    }else if (newCategory1 !== undefined && newCategory1.trim() !== ""){
      console.log("solo el primero", newCategory1);
      this.categories.unshift(newCategory1);
        console.log("Nueva categoría 1:", newCategory1);
        this.buscarProducto(newCategory1, newCategory2);

    }else if (newCategory2 !== undefined && newCategory2 > 0){

        console.log("solo el segundo");
        this.categories2.unshift(newCategory2);
        console.log("Nueva categoría 1:", newCategory2);
        this.buscarProducto(newCategory1, newCategory2);
    }
  

  
    //console.log("Categorías actualizadas:", this.categories);
  }
  

  buscarProducto(query?: string, query2?: number): void {



    if (query !== undefined && query.trim() !== "" && query2 !== undefined && query2 > 0) {
      
      console.log("No puede serrrrr2")
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        console.log("noo",response);
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        console.log("este",response);
        this.subasta = response;
      });
     
    
  
    }else if (query !== undefined && query.trim() !== ""){

      console.log("No puede serrrrr2")
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        console.log("noo",response);
        this.productos = response;
      });
    
      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        console.log("este",response);
        this.subasta = response;
      });
  
    }else if (query2 !== undefined && query2 > 0){

      console.log("No puede serrrrr2")
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        console.log("noo",response);
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        console.log("este",response);
        this.subasta = response;
      });
     
      
      
    } else{

      console.log("No puede serrrrr2")
      this.userService.buscarProducto(query, query2).subscribe((response: any) => {
        console.log("noo",response);
        this.productos = response;
      });

      this.userService.buscarSubasta(query, query2).subscribe((response: any) => {
        console.log("este",response);
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


}
