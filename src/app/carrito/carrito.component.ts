import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  productos: any[] = [];
  total: number = 0;

  constructor(
    public userService: UsersService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Obtener el id_usuario de la cookie del usuario (debes implementar esto)
    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();

    // Cargar productos del carrito basados en el id_usuario
    this.loadCarritoProductos(idUsuarioFromCookie);
  }

  getdir():string{
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.direccion || '';
    }

    return ""; // Ejemplo: reemplaza esto con la lógica real

  }

  getIdUsuarioFromCookie(): number {
    const userData = this.cookieService.get('user');
    if (userData) {
      const userObject = JSON.parse(userData);
      // console.log(userObject.id_usuario+ ''+ typeof userObject.id_usuario)
      return userObject.id_usuario || '';
    }

    return 1; // Ejemplo: reemplaza esto con la lógica real
  }

  eliminarProducto(id_carrito: number) {
    try {
      this.userService.EliminarCarrito(id_carrito).subscribe(
        () => {
          const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
          this.loadCarritoProductos(idUsuarioFromCookie);
        },
        (error) => {
          console.error('Error al eliminar el carrito:', error);
        }
      );
    } catch (error) {
      console.error('Error inesperado al eliminar el carrito:', error);
    } finally {
      // Refrescar la página actual
      window.location.reload();
    }
  }

  realizarCompra() {
    // Obtener el id_usuario de la cookie del usuario
    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();

    const dir = this.getdir();

    // Crear un objeto de pedido con los datos necesarios
    const pedido = {
      total_pagar: this.total, // Reemplaza con el valor correcto
      fecha_pedido: new Date().toISOString(),
      id_estado_pedido: 1, // Reemplaza con el valor correcto
      id_usuario: idUsuarioFromCookie,
      ubicacion: dir, // Reemplaza con la ubicación correcta
    };
    console.log(pedido) //{total_pagar: 1749.9, fecha_pedido: '2023-09-22T19:38:57.725Z', id_estado_pedido: 1, id_usuario: 1, ubicacion: 'raulvalenciau@gmail.com'}

    // Enviar la solicitud POST al endpoint de creación de pedido
    try {
      this.userService.CrearPedido(pedido).subscribe(
        (response: any) => {
          console.log('Pedido creado con éxito:', response);


          // Perform additional actions if needed.
        },
        (error) => {
          console.error('Error al crear el pedido:', error);
        }
      );

    } catch (error) {
      console.error('Error inesperado al crear el pedido:', error);
      console.log(pedido)
    }
    this.LimpiarCarrito();
  }
  calcularTotal(): void {
    let total = 0;

    for (const producto of this.productos) {
      // Verificar si los valores son numéricos y no están indefinidos
      const cantidad = typeof producto.cantidad === 'number' && !isNaN(producto.cantidad) ? producto.cantidad : 0;
      const precio = typeof producto.total === 'number' && !isNaN(producto.total) ? producto.total : 0;

      const precioTotalPorProducto = cantidad * precio;
      total += precioTotalPorProducto;
    }

    this.total = total; // Asignar el total al campo total
  }
  loadCarritoProductos(idUsuario: number): void {
    this.userService.ObtenerCarrito(idUsuario).subscribe((response: any) => {
      // console.log(response); // Agrega esta línea para depurar la respuesta

      // Asignar los resultados a la variable productos
      this.productos = response;

      // Calcular el total después de asignar los productos
      this.calcularTotal();
    });
  }
  LimpiarCarrito(){

    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();

    try {
      this.userService.elimiarCarritoVenta(idUsuarioFromCookie).subscribe(
        () => {
          // const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
          // this.loadCarritoProductos(idUsuarioFromCookie);
        },
        (error) => {
          console.error('Error al eliminar el carrito:', error);
        }
      );
    } catch (error) {
      console.error('Error inesperado al eliminar el carrito:', error);
    } finally {
      // Refrescar la página actual
      window.location.reload();
    }


  }

}
