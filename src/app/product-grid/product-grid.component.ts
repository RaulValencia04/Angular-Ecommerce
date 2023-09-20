import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {
  categories: string[] = [];
  productos: any[] = [];
  inputValue = '';

  constructor(public userService: UsersService) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    // No se llama a buscarProducto en la carga inicial para evitar resultados vacíos.
    this.buscarProducto('');
  }

  addCategory(newCategory: string): void {
    if (!this.categories.includes(newCategory)) {
      this.categories.unshift(newCategory); // Agrega al principio del arreglo
      // this.inputValue = ''; // Limpia el input
      // Realiza la búsqueda al agregar una categoría
      this.buscarProducto(newCategory);
    }
  }

  buscarProducto(query: string): void {
    // Obtener el valor del input antes de la petición
    query = query.trim(); // Elimina espacios en blanco

    // Ahora puedes mostrar el valor en la consola si lo necesitas
    console.log("Búsqueda realizada: " + query);

    this.userService.buscarProducto(query).subscribe((response: any) => {
      console.log(response); // Agrega esta línea para depurar la respuesta

      // Asignar los resultados a la variable productos
      this.productos = response;
    });
  }
}
