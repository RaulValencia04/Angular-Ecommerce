import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-add-productos',
  templateUrl: './add-productos.component.html',
  styleUrls: ['./add-productos.component.css']
})


export class AddProductosComponent implements OnInit{

  categorias: any[] = [];
  // fecha_inicios: string = ""; 
  //codigo para la fecha

  ngOnInit() {

    // const fechaHoraActual = new Date();
    // this.fecha_inicios = fechaHoraActual.toISOString().slice(0, 16);



    // Código que se ejecutará cuando el componente se inicie
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

    

    selectedFile: File | null = null;

    constructor(public userService: UsersService, private router: Router, private http: HttpClient) {}




  
    onFileSelected(event: any) {
      // Obtén el archivo seleccionado
      this.selectedFile = event.target.files[0];
    }


  
   guardarProducto() {

    if (!this.selectedFile) {
      alert('Selecciona una imagen primero.');
      return;
    }
    // Gyuardar imagen en el servidor 
    const formData = new FormData();
    formData.append('imagen', this.selectedFile);

    this.http.post<any>('http://localhost:3000/subir-imagen', formData).subscribe(
      (respuesta) => {
        // Aquí puedes manejar la respuesta del servidor que debería contener la URL de la imagen cargada.
        console.log('URL de la imagen cargada:', respuesta.imageUrl);

      // Almacena la URL de la imagen en imagen_url
      this.imagen_url = respuesta.imageUrl;

      console.log(this.imagen_url)

         // Resto del código para guardar el producto en la base de datos
      const user = {
        nombre: this.nombre,
        precio: this.precio,
        precioSubasta: this.precio_subasta,
        imagen_url: respuesta.imageUrl,
        descripcion: this.descripcion,
        id_categoria: this.id_categoria,
        estado: this.estado,
        fecha_inicio: this.fecha_inicio,
        fecha_final: this.fecha_final,
        tipo_producto: this.tipo_producto
      };

      console.log(user);


          this.userService.agregarProductos(user).subscribe(
            (data: any) => {
              // Assuming data.token exists in the response
              if (data.token) {
                this.userService.setToken(data.token);
                this.router.navigateByUrl("/");
              } else {
                console.log("si llega aqui inserto datos");
              }
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

    //-----------------------------

     
    };
}


