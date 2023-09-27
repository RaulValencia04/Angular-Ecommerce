import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { da } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
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
    return this.http.post('http://localhost:5022/api/Usuario/add', user);
  }
  setToken(token: String) {
    this.cookies.set('token', token);
  }
  getToken() {
    return this.cookies.get('token');
  }
  getUser() {
    return this.http.get('https://reqres.in/api/users/2');
  }
  agregarProductos(user: any): Observable<any> {
    return this.http.post('http://localhost:5022/api/Producto/add', user);
  }



  buscarProducto(query: any, query2: any): Observable<any> {
    var url = '';

    if(typeof query === 'string' && query2 > 0){
      url = `http://localhost:5022/api/Producto/GetAll?q=${query}&categoria=${query2}&tipo=Venta`;
    }else if(query2 > 0) {
      url = `http://localhost:5022/api/Producto/GetAll?categoria=${query2}&tipo=Venta`;
    }else if (typeof query === 'number') {
      url = `http://localhost:5022/api/Producto/GetAll?limit=${query}&tipo=Venta`;
    } else if (typeof query === 'string') {
      url = `http://localhost:5022/api/Producto/GetAll?q=${query}&tipo=Venta`;
    }

    return this.http.get(url);
  }




  buscarSubasta(query: any, query2: any): Observable<any> {
    var url = '';

    if(typeof query === 'string' && query2 > 0){
      url = `http://localhost:5022/api/Producto/GetAll?q=${query}&categoria=${query2}&tipo=Subasta`;
    }else if(query2 > 0) {
      url = `http://localhost:5022/api/Producto/GetAll?categoria=${query2}&tipo=Subasta`;
    }else if (typeof query === 'number') {
      url = `http://localhost:5022/api/Producto/GetAll?limit=${query}&tipo=Subasta`;
    } else if (typeof query === 'string') {
      url = `http://localhost:5022/api/Producto/GetAll?q=${query}&tipo=Subasta`;
    }

    return this.http.get(url);
  }
  buscarSubasta2(query: any): Observable<any> {

    var url = ``
    if (typeof query === 'number') {
      url = `http://localhost:5022/api/Producto/GetAll?limit=${query}&tipo=Subasta`;
    } else if (typeof query === 'string') {
      url = `http://localhost:5022/api/Producto/GetAll?q=${query}&tipo=Subasta`;
    }


    return this.http.get(url)
  }

  BuscarPorId(query: any): Observable<any> {
    var url = '';

    if (typeof query === 'number') {

      url = `http://localhost:5022/api/Producto/GetporId?limit=${query}`;
    }

    return this.http.get(url);
  }
  ObtenerCarrito(query: any): Observable<any> {
    const url = `http://localhost:5022/api/Carrito/Getbyname?q=${query}`;
    return this.http.get(url);
  }
  EliminarCarrito(query: number) {

    const url = `http://localhost:5022/api/Carrito/deleteCarrito/${query}`;

    return this.http.delete(url).pipe();
  }
  AgregarDetalle(data: any[]): Observable<any> {
    // Verifica que data sea una matriz y que contenga al menos un elemento
    if (Array.isArray(data) && data.length > 0) {
      const url = `http://localhost:5022/api/DetallePedido/add`;

      // Utiliza un bucle for para recorrer los elementos del array y enviarlos
      for (const detallePedido of data) {


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
  AgregarCarrito(data: any) {
    const url = `http://localhost:5022/api/Carrito/add`;
    // Devuelve el observable en lugar de suscribirte aquí
    return this.http.post(url, data);
  }
  CrearPedido(data: any) {
    const url = `http://localhost:5022/api/pedido/add`;
    // Devuelve el observable en lugar de suscribirte aquí
    return this.http.post(url, data);
  }
  elimiarCarritoVenta(query: number) {
    console.log('id carrito ' + query);

    const url = `http://localhost:5022/api/Carrito/deleteCarritoByUsuario/${query}`;
    // /api/Carrito/deleteCarritoByUsuario/{q}

    return this.http.delete(url).pipe();
  }
  realizarPuja(
    idProducto: number,
    precioPuja: number,
    idUsuario: number
  ): Observable<any> {
    // Crea un objeto con los datos de la puja y el ID de usuario
    const pujaData = {
      PrecioPuja: precioPuja,
      IdUsuario: idUsuario,
    };
    console.log(pujaData);
    // Realiza la solicitud PUT para enviar la puja y el ID de usuario
    return this.http.put(
      `http://localhost:5022/api/Producto/ActualizarSubasta/${idProducto}`,
      pujaData
    );
  }
  ActualizarEstadoSubasta(idProducto: number) {
    const url = `http://localhost:5022/api/Producto/ActualizarEstadoSubasta/${idProducto}`;
    console.log('estado' + idProducto);
    return this.http.put(url, {}).subscribe(
      (data) => {
        console.log('PUT Request is successful ', data);
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }
  ActualizarUsuario(idProducto: number) {

    const url = `http://localhost:5022/api/Producto/ActualizarEstadoSubasta/${idProducto}A NULL`;
    console.log(url);
    console.log('estado' + idProducto);
    return this.http.put(url, {}).subscribe(
      (data) => {
        console.log('PUT Request is successful ', data);
      },
      (error) => {
        console.log('Error', error);
      }
    );
  }
  obtenerListCategorias() {
    return this.http.get(
      'http://localhost:5022/api/Categoria/Categoria/GetAll'
    );
  }
  obtenerEstadoSubasta(idSubasta: number){
    const url = `http://localhost:5022/api/Producto/GetporId?limit=${idSubasta}`;
    return this.http.get(url);
  }
  obtenersubastasAbiertas() {
    return this.http.get('http://localhost:5022/api/Producto/GetSBabiertas');
  }
  obtenersubastasCerradas() {
    return this.http.get('http://localhost:5022/api/Producto/GetSBcerradas');
  }
  ObtenerGanador(data: number): Observable<any>{

   const url =`http://localhost:5022/api/Producto/GetProductosByUserId/${data}`
    return this.http.get(url);
  }
  ObtenerSubastaActivosme(data: number): Observable<any>{

    const url =`http://localhost:5022/api/Producto/GetSBabiertasByUser?id_usuario=${data}`
     return this.http.get(url);
   }
   ObtenerSubastaCerradame(data: number): Observable<any>{

    const url =`http://localhost:5022/api/Producto/GetSBcerradasbyuser?id_usuario=${data}`
     return this.http.get(url);
   }
   factura(data:any){

    const url = `http://localhost:5022/api/Pedido/GetAllscc?idUsuario=${data}`;


    return this.http.get(url)
   }
   EliminarSubasta(data: number): Observable<any>{

    const url =`http://localhost:5022/api/Producto/deleteProducto/${data}`

    return this.http.delete(url);

   }
   EliminarPedido(data: number): Observable<any>{

    const url =`http://localhost:5022/api/Pedido/deletePedidobyUser/${data}`

    return this.http.delete(url);

   }
   GetSubastasOpen(){

    const url = `http://localhost:5022/api/Producto/GetAll?tipo=Subasta`

    return this.http.get(url);

// EJEMLO DEL RETURN[
//   {
//     "id_producto": 44,
//     "nombre": "producto#2",
//     "precio": 0,
//     "precio_subasta": 3,
//     "imagen_url": "assets/carpeta_imagenes/1695744540833-309947139.jpeg",
//     "descripcion": "crisisisisisiss",
//     "id_categoria": 1,
//     "estado": 0,
//     "fecha_inicio": "2023-09-26T10:08:00",
//     "fecha_final": "2023-09-26T10:09:00",
//     "tipo_producto": "Subasta",
//     "id_usuario": 1,
//     "id_usuario_ultima_puja": 1
//   },
//   {
//     "id_producto": 45,
//     "nombre": "producto#3",
//     "precio": 0,
//     "precio_subasta": 6,
//     "imagen_url": "assets/carpeta_imagenes/1695744558247-305197267.jpeg",
//     "descripcion": "crisisisisisiss",
//     "id_categoria": 1,
//     "estado": 0,
//     "fecha_inicio": "2023-09-26T10:08:00",
//     "fecha_final": "2023-09-26T10:10:00",
//     "tipo_producto": "Subasta",
//     "id_usuario": 1,
//     "id_usuario_ultima_puja": 1
//   }
// ]


   }
}
