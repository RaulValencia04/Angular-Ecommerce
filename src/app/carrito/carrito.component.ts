import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../users/users.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Renderer2, ElementRef } from '@angular/core';




@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['../../assets/css/tarjeta.css'],

})
export class CarritoComponent implements OnInit {
  productos: any[] = [];
  total: number = 0;
  cantidad: number= 0;


  constructor(
    public userService: UsersService,
    private cookieService: CookieService,
    private renderer: Renderer2,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    // Obtener el id_usuario de la cookie del usuario (debes implementar esto)
    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();

    // Cargar productos del carrito basados en el id_usuario
    this.loadCarritoProductos(idUsuarioFromCookie);
  }





  agregarDetalle(data: any) {
    // Realiza la solicitud POST para agregar un detalle de pedido al carrito
    try {
      this.userService.AgregarDetalle(data).subscribe(
        (response: any) => {
          console.log('Detalle de producto agregado con éxito:', response);
          // Recarga los productos en el carrito después de agregar un detalle
          const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
          this.loadCarritoProductos(idUsuarioFromCookie);
        },
        (error: any) => {
          console.error('Error al agregar el detalle de producto:', error);
          if (error instanceof HttpErrorResponse) {
            console.error('Estado del error:', error.status);
            console.error('Mensaje de error:', error.message);
            console.error('Cuerpo de la respuesta del servidor:', error.error);
          }
        }
      );

    } catch (error) {
      console.error('Error inesperado al agregar el detalle de producto:', error);
    }
  }




  realizarCompra() {
    // Obtener el id_usuario de la cookie del usuario
    const idUsuarioFromCookie = this.getIdUsuarioFromCookie();
    const dir = this.getdir();
    const modalElement = document.getElementById('myModal');
    const modalBackdropElement = document.querySelector('.modal-backdrop');
  
    if (modalElement) {
      // Hide the modal
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  
    if (modalBackdropElement) {
      // Remove the backdrop
      modalBackdropElement.parentElement?.removeChild(modalBackdropElement);
    }
  
    // Crear un objeto de pedido con los datos necesarios
    const pedido = {
      totalPagar: this.total,
      fechaPedido: new Date().toISOString(),
      estadoPedido: {
        idEstadoPedido: 1
      },
      usuario: { idUsuario: idUsuarioFromCookie },
      ubicacion: dir,
    };
  
    // Enviar la solicitud POST al endpoint de creación de pedido
    try {
      this.userService.CrearPedido(pedido).subscribe(
        (response: any) => {
          console.log('Pedido creado con éxito:', response);
  
          const idPedido = response.idPedido;
  
          // Crear un arreglo para almacenar los detalles de pedido
          const detallesPedido = [];
  
          // Recorrer los productos en el carrito y crear objetos de detalle de pedido
          for (const producto of this.productos) {
            const detallePedido = {
              producto: { idProducto: producto.idProducto },
              pedido: { idPedido: idPedido }, // Usar el id_pedido obtenido
              cantidad: producto.cantidad,
            };
            detallesPedido.push(detallePedido);
          }
          console.log(detallesPedido);
  
          // Enviar los detalles del pedido
          this.userService.AgregarDetalle(detallesPedido).subscribe(
            (response) => {
              console.log('Detalles del pedido agregados con éxito:', response);
              this.router.navigateByUrl("/factura");
            },
            (error) => {
              console.error('Error al agregar los detalles del pedido:', error);
            }
          );
        },
        (error) => {
          console.error('Error al crear el pedido:', error);
        }
      );
    } catch (error) {
      console.error('Error inesperado al crear el pedido:', error);
    } finally {
      const modalElement = this.el.nativeElement.querySelector('#myModal');
      this.renderer.removeClass(modalElement, 'show');
      this.renderer.setStyle(modalElement, 'display', 'none');
      this.LimpiarCarrito();
      // Eliminar la clase 'modal-open' del elemento 'body'
      document.body.classList.remove('modal-open');
    }
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
    return userObject.idUsuario || '';
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



  calcularTotal(): void {
    let total = 0;

    for (const producto of this.productos) {
      // Verificar si los valores son numéricos y no están indefinidos
      const cantidad = typeof producto.cantidad === 'number' && !isNaN(producto.cantidad) ? producto.cantidad : 0;
      var precio = 0;
      if (producto.tipoProducto.toString().includes("Subasta")){
        const precioSubasta = producto.precioSubasta;
          precio = precioSubasta;
      }else{
        precio = typeof producto.total === 'number' && !isNaN(producto.total) ? producto.total : 0;
      }




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

    }

  }

}
