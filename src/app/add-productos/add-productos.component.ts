import { Component } from '@angular/core';
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';



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
    estado: number = 0.0;
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

        // Supongamos que 'carpeta_imagenes' es la carpeta en la que quieres guardar las imágenes
      const imagePath = `carpeta_imagenes/${respuesta.imageUrl}`;

      // Aquí deberías enviar el archivo al servidor y obtener la URL de la imagen
      // Simulación de obtener la URL de la imagen después de la carga
      const imageUrl = imagePath;

      // Almacena la URL de la imagen en imagen_url
      this.imagen_url = imageUrl;
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );

    //-----------------------------

      // Resto del código para guardar el producto en la base de datos
      const user = {
        nombre: this.nombre,
        precio: this.precio,
        precioSubasta: this.precio_subasta,
        imagen_url: this.imagen_url,
        descripcion: this.descripcion,
        id_categoria: this.id_categoria,
        estado: this.estado,
        fecha_inicio: this.fecha_inicio,
        fecha_final: this.fecha_final,
        tipo_producto: this.tipo_producto
      };

      console.log(user);
    };

}


