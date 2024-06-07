import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { da } from 'date-fns/locale';


@Injectable({
  providedIn: 'root',
})
export class UsersService {
  cookies: any;
  private apiUrl = 'http://localhost:8080/api/producto';
  private readonly baseUrl = 'http://localhost:8080/api/producto';

  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    const params = new HttpParams()
      .set('correo', user.correo)
      .set('password', user.password);

    return this.http.post('http://localhost:8080/api/usuario/login', user);
  }

  register(user: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/usuario/add', user);
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
    console.log(user);
    return this.http.post('http://localhost:8080/api/producto/add', user);
  }



  buscarProducto(query: any, query2: any): Observable<any> {
    let url = '';

    if (typeof query === 'string' && query2 > 0) {
      url = `${this.apiUrl}/buscarPorNombreYCategoria?q=${query}&categoria=${query2}&tipo=Venta`;
    } else if (query2 > 0) {
      url = `${this.apiUrl}/buscarPorCategoria?categoria=${query2}&tipo=Venta`;
    } else if (typeof query === 'number') {
      url = `${this.apiUrl}/buscarConLimite?limit=${query}&tipo=Venta`;
    } else if (typeof query === 'string') {
      url = `${this.apiUrl}/buscarPorNombre?q=${query}&tipo=Venta`;
    }

    return this.http.get(url);
  }


  buscarSubasta(query: any, query2: any): Observable<any> {
    let url = '';

    if (typeof query === 'string' && query2 > 0) {
      url = `${this.apiUrl}/buscarPorNombreYCategoria?q=${query}&categoria=${query2}`;
    } else if (query2 > 0) {
      url = `${this.apiUrl}/buscarPorCategoria?categoria=${query2}`;
    } else if (typeof query === 'number') {
      url = `${this.apiUrl}/buscarConLimite?limit=${query}`;
    } else if (typeof query === 'string') {
      url = `${this.apiUrl}/buscarPorNombre?q=${query}`;
    }

    return this.http.get(url);
  }
  GetSubastasOpen(): Observable<any> {
    const url = `${this.apiUrl}/GetSBabiertas`;

    return this.http.get(url);
  }
  obtenerListCategorias() {
    return this.http.get(
      'http://localhost:8080/api/categoria/GetAll'
    );
  }
  buscarSubasta2(query: any): Observable<any> {
    let url = '';

    if (typeof query === 'number') {
      url = `${this.apiUrl}/buscarConLimite?limit=${query}`;
    } else if (typeof query === 'string') {
      url = `${this.apiUrl}/buscarPorNombre?q=${query}`;
    }

    return this.http.get(url);
  }
  obtenerEstadoSubasta(idSubasta: number) {
    const url = `http://localhost:8080/api/producto/GetporId?q=${idSubasta}`;
    console.log(this.http.get(url));
    return this.http.get(url);
  }
  BuscarPorId(query: any): Observable<any> {
    let url = '';

    if (!isNaN(query)) {
      url = `http://localhost:8080/api/producto/GetporId?q=${query}`;
    } else {
      console.error('El parámetro query no es un número válido');
      return of(null);
    }

    return this.http.get(url);
  }
  realizarPuja(idProducto: number,precioPuja: number,idUsuario: number): Observable<any> {
    // Crea un objeto con los datos de la puja y el ID de usuario
    const pujaData = {
      precioPuja: precioPuja,
      idUsuario: idUsuario,
    };
    console.log(pujaData);
    // Realiza la solicitud PUT para enviar la puja y el ID de usuario
    return this.http.put(
      `http://localhost:8080/api/producto/puja/${idProducto}`,pujaData
    );
  }
  AgregarCarrito(data: any): Observable<any> {
    console.log(data);
    const url = `http://localhost:8080/api/carrito/add`;
    // Devuelve el observable en lugar de suscribirte aquí
    return this.http.post(url, {
      usuario: { idUsuario: data.usuario.idUsuario },
      producto: { idProducto: data.producto.idProducto },
      cantidad: data.cantidad,
      fechaAgregado: data.fechaAgregado
    });
  }
  
  
  
  ObtenerCarrito(query: any): Observable<any> {

    console.log(query);
    const url = `http://localhost:8080/api/carrito/getbyusuario?idUsuario=${query}`;
    return this.http.get(url);
  }

  EliminarCarrito(query: number) {

    const url = `http://localhost:8080/api/carrito/delete/${query}`;

    return this.http.delete(url).pipe();
  }
  ObtenerSubastaActivosme(data: number): Observable<any> {
    const url = `http://localhost:8080/api/producto/estado-tipo-usuario?id_usuario=${data}`
    return this.http.get(url);
  }
  ObtenerSubastaCerradame(data: number): Observable<any> {

    const url = `http://localhost:8080/api/producto/estado-tipo-usuario-estado-1?id_usuario=${data}`
    return this.http.get(url);
  }

  AgregarDetalle(data: any[]): Observable<any> {
    // Verifica que data sea una matriz y que contenga al menos un elemento
    if (Array.isArray(data) && data.length > 0) {
      console.log(data);
      const url = `http://localhost:8080/api/detallePedido/add`;
  
      // Realiza la solicitud POST para el arreglo completo de detalles del pedido
      return this.http.post(url, data).pipe(
        tap(
          (response: any) => {
            // Maneja la respuesta si es necesario
            console.log('Respuesta del servidor:', response);
          },
          (error: any) => {
            // Maneja errores si es necesario
            console.error('Error en la solicitud POST:', error);
          }
        )
      );
    } else {
      console.error('El objeto data no es una matriz o está vacío.');
      return of(null); // Devuelve un observable nulo en caso de error
    }
  }
  

  CrearPedido(data: any) {
    console.log(data);
    const url = `http://localhost:8080/api/pedido/add`;
    // Devuelve el observable en lugar de suscribirte aquí
    return this.http.post(url, data);
  }
  
  EliminarSubasta(data: number): Observable<any> {

    const url = `http://localhost:8080/api/producto/deleteProducto/${data}`

    return this.http.delete(url);

  }

  elimiarCarritoVenta(query: number) {
    console.log('id carrito ' + query);

    const url = `http://localhost:8080/api/carrito/deleteCarritoByUsuario/${query}`;
    // /api/Carrito/deleteCarritoByUsuario/{q}

    return this.http.delete(url).pipe();
  }
  factura(idUsuario: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/pedido/getDatosUnidos?idUsuario=${idUsuario}`);
  }

  EliminarPedido(idUsuario: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/pedido/deleteByUsuario/${idUsuario}`);
  }
  actualizarEstadoSubasta(idProducto: number): Observable<any> {
    const url = `${this.baseUrl}/ActualizarEstadoSubasta/${idProducto}`;
    return this.http.put(url, {});
  }

  actualizarUsuario(idProducto: number): Observable<any> {
    const url = `${this.baseUrl}/ActualizarEstadoSubasta/${idProducto}/ANULL`;
    return this.http.put(url, {});
  }

  obtenerSubastasAbiertas(): Observable<any> {
    const url = `${this.baseUrl}/GetSBabiertas`;
    return this.http.get(url);
  }

  obtenerSubastasCerradas(): Observable<any> {
    const url = `${this.baseUrl}/GetSBcerradas`;
    return this.http.get(url);
  }

  obtenerGanador(idUsuario: number): Observable<any> {
    const url = `${this.baseUrl}/GetProductosByUserId/${idUsuario}`;
    return this.http.get(url);
  }

  
  //! HACIENDO



  // TODO







}
