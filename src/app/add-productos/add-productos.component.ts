import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: 'app-add-productos',
  templateUrl: './add-productos.component.html',
  styleUrls: ['./add-productos.component.css']
})


export class AddProductosComponent implements OnInit {

  categorias: any[] = [];
  formSubmitted = false;
  // fecha_inicios: string = ""; 
  //codigo para la fecha

  ngOnInit() {

    // const fechaHoraActual = new Date();
    // this.fecha_inicios = fechaHoraActual.toISOString().slice(0, 16);

    const userCookie = this.cookieService.get("user");

    if(!userCookie){
      this.router.navigateByUrl("/");
    }   

    // Código que se ejecutará cuando el componente se inicie
    this.userService.obtenerListCategorias().subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data) {
          this.categorias = data;
        } 
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get("user");
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.id_usuario || "";

    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }




  nombre: string = "";
  precio: number = 0.0;
  precio_subasta: number = 0.0;
  imagen_url: string = "";
  descripcion: string = "";
  id_categoria: number = 0;
  estado: number = 0;
  fecha_inicio: Date = new Date();
  fecha_final: Date = new Date();
  tipo_producto: string = "";
  id_usuario: number = 0;



  selectedFile: File | null = null;

  constructor(public userService: UsersService, private router: Router, private http: HttpClient, private cookieService: CookieService) { }





  onFileSelected(event: any) {
    // Obtén el archivo seleccionado
    this.selectedFile = event.target.files[0];
  }


  mostrarAlerta() {
    Swal.fire({
      title: 'Producto creado Correctamente',
      icon: 'success', // Puedes cambiar el ícono a tu gusto (success, error, warning, etc.)
      timer: 2500, // Tiempo de visualización en milisegundos (2 segundos)
      showConfirmButton: false // Oculta el botón de confirmación
    });
  }


  guardarProducto() {
    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();

    if (!this.selectedFile) {
      alert('Selecciona una imagen primero.');
      return;
    }


    if ((this.tipo_producto.toString().includes("Venta") && this.precio <= 0)
      || (this.tipo_producto.toString().includes("Subasta") && (this.precio_subasta <= 0)
          )
      || (this.nombre.toString().length === 0
        || this.estado.toString().length === 0
        || this.id_categoria.toString().length === 0
        || this.descripcion.toString().length === 0
        || this.tipo_producto.toString().length === 0
        )
        ) 
      {
      return;
    }
    if ((this.fecha_inicio.toString() >= this.fecha_final.toString()) && this.tipo_producto.toString().includes("Subasta")) {
      alert('La fecha de fin de subasta tiene que ser mayor a la inicial.');
      return;
    }

   
    // Gyuardar imagen en el servidor 
    const formData = new FormData();
    formData.append('imagen', this.selectedFile);

    this.http.post<any>('http://localhost:3000/subir-imagen', formData).subscribe(
      (respuesta) => {
        // Aquí puedes manejar la respuesta del servidor que debería contener la URL de la imagen cargada.

        // Almacena la URL de la imagen en imagen_url
        this.imagen_url = respuesta.imageUrl;


        // Resto del código para guardar el producto en la base de datos
        const user = {
          nombre: this.nombre,
          precio: this.precio,
          precio_subasta: this.precio_subasta,
          imagen_url: respuesta.imageUrl,
          descripcion: this.descripcion,
          id_categoria: this.id_categoria,
          estado: this.estado,
          fecha_inicio: this.fecha_inicio,
          fecha_final: this.fecha_final,
          tipo_producto: this.tipo_producto,
          id_usuario: idUsuarioFromCookie
        };


        



        // Todos los campos están llenos, proceder con el registro
        this.userService.agregarProductos(user).subscribe(
          (data: any) => {
            // Assuming data.token exists in the response
            if (data.token) {
              this.userService.setToken(data.token);
              this.router.navigateByUrl("/");
            } 



            this.mostrarAlerta();
            this.router.navigateByUrl("/listaProductos");
          },
          (error) => {
            console.log(error);
          }
        );



      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );


  };
}


