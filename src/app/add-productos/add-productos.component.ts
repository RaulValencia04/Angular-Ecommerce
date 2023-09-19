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


    selectedFile: File | null = null;

    constructor(public userService: UsersService, private router: Router) {}
  
    onFileSelected(event: any) {
      // Obtén el archivo seleccionado
      this.selectedFile = event.target.files[0];
    }
  
   guardarProducto() {
  if (this.selectedFile) {
    const reader = new FileReader();

    // Función de carga del lector de archivos
    reader.onload = (e) => {
      // Guardar el archivo localmente en una carpeta del proyecto
      const fileContent = reader.result as string;
      const imageName = this.selectedFile!.name;  // ! asegura a TypeScript que selectedFile no será null

      // Supongamos que 'carpeta_imagenes' es la carpeta en la que quieres guardar las imágenes
      const imagePath = `carpeta_imagenes/${imageName}`;

      // Aquí deberías enviar el archivo al servidor y obtener la URL de la imagen
      // Simulación de obtener la URL de la imagen después de la carga
      const imageUrl = imagePath;

      // Almacena la URL de la imagen en imagen_url
      this.imagen_url = imageUrl;

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

    // Leer el contenido del archivo como una URL de datos
    reader.readAsDataURL(this.selectedFile);
  } else {
    console.error('No se ha seleccionado un archivo.');
  }
}

}
