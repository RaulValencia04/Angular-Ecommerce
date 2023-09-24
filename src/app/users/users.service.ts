
import { CookieService } from "ngx-cookie-service";
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class UsersService {

  cookies: any;

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    const params = new HttpParams()
      .set('correo', user.correo)
      .set('password', user.password);

    return this.http.post('http://localhost:5022/api/Usuario/login', user);
  }
  register(user: any): Observable<any> {
    return this.http.post("http://localhost:5022/api/Usuario/add", user);
  }
  setToken(token: String) {
    this.cookies.set("token", token);
  }
  getToken() {
    return this.cookies.get("token");
  }
  getUser() {
    return this.http.get("https://reqres.in/api/users/2");
  }
  agregarProductos(user: any): Observable<any> {
    console.log(user)
    return this.http.post('http://localhost:5022/api/Producto/add', user);
  }



  buscarProducto(query: any): Observable<any> {
    console.log("busqueda: "+query)
    var url = ''

    if (typeof query === 'number') {

      url = `http://localhost:5022/api/Producto/GetAll?limit=${query}&tipo=Venta`;

    } else if (typeof query === 'string') {

       url = `http://localhost:5022/api/Producto/GetAll?q=${query}&tipo=Venta`;

    }

    return this.http.get(url);
  }

  buscarSubasta(query: any): Observable<any> {
    console.log("busqueda: "+query)
    var url = ''

    if (typeof query === 'number') {

       url = `http://localhost:5022/api/Producto/GetAll?limit=${query}&tipo=Subasta`;

    } else if (typeof query === 'string') {

       url = `http://localhost:5022/api/Producto/GetAll?q=${query}&tipo=Subasta`;

    }

    return this.http.get(url);
  }

  BuscarPorId(query: any): Observable<any> {
    console.log("busqueda: "+query)
    var url = ''

    if (typeof query === 'number') {
      console.log("busqueda: "+query)

       url = `http://localhost:5022/api/Producto/GetporId?limit=${query}`;

    }

    return this.http.get(url);
  }


  ObtenerCarrito(query: any):Observable<any> {

   const url = `http://localhost:5022/api/Carrito/Getbyname?q=${query}`;
    return this.http.get(url);
  }
  EliminarCarrito(query: number){

    console.log("id carrito "+query)

    const url = `http://localhost:5022/api/Carrito/deleteCarrito/${query}`;

    return this.http.delete(url).pipe(

    );

  }

  AgregarDetalle(data: any[]): Observable<any> {
    // Verifica que data sea una matriz y que contenga al menos un elemento
    if (Array.isArray(data) && data.length > 0) {
      const url = `http://localhost:5022/api/DetallePedido/add`;

      // Utiliza un bucle for para recorrer los elementos del array y enviarlos
      for (const detallePedido of data) {
        console.log(detallePedido);
        console.log(detallePedido.id_pedido);
        console.log(detallePedido.id_producto);
        console.log(detallePedido.cantidad);

        // Realiza la solicitud POST para cada detallePedido
        this.http.post(url, detallePedido).subscribe(
          (response) => {
            // Maneja la respuesta si es necesario
            console.log('Respuesta del servidor:', response);
          },
          (error) => {
            // Maneja errores si es necesario
            console.error('Error en la solicitud POST:', error);
          }
        );
      }

      // Devuelve un observable que indica que la solicitud se ha completado
      return of('Solicitud POST en proceso');
    } else {
      console.error('El objeto data no es una matriz o está vacío.');
      return of(null); // Devuelve un observable nulo en caso de error
    }
  }

  AgregarCarrito(data: any){
    const url = `http://localhost:5022/api/Carrito/add`;
    // Devuelve el observable en lugar de suscribirte aquí
    return this.http.post(url,data);
  }

  CrearPedido(data: any){

    const url = `http://localhost:5022/api/pedido/add`;
    // Devuelve el observable en lugar de suscribirte aquí
    return this.http.post(url,data);

  }

  elimiarCarritoVenta(query: number){

    console.log("id carrito "+query)

    const url = `http://localhost:5022/api/Carrito/deleteCarritoByUsuario/${query}`;
    // /api/Carrito/deleteCarritoByUsuario/{q}

    return this.http.delete(url).pipe(

    );


  }

  realizarPuja(idProducto: number, precioPuja: number, idUsuario: number): Observable<any> {
    // Crea un objeto con los datos de la puja y el ID de usuario
    const pujaData = {
      PrecioPuja: precioPuja,
      IdUsuario: idUsuario
    };
    console.log(pujaData);
    // Realiza la solicitud PUT para enviar la puja y el ID de usuario
    return this.http.put(`http://localhost:5022/api/Producto/ActualizarSubasta/${idProducto}`, pujaData);
  }


  obtenerListCategorias() {
    return this.http.get("http://localhost:5022/api/Categoria/Categoria/GetAll");
  }


  obtenersubastasAbiertas() {
    return this.http.get("http://localhost:5022/api/Producto/GetSBabiertas");
  }

  obtenersubastasCerradas() {
    return this.http.get("http://localhost:5022/api/Producto/GetSBcerradas");
  }



}
