
import { CookieService } from "ngx-cookie-service";
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
    return this.http.post('http://localhost:5022/api/Producto/add', user);
  }

  buscarProducto(query: any): Observable<any> {
    console.log("busqueda: "+query)
    var url = ''

    if (typeof query === 'number') {

       url = `http://localhost:5022/api/Producto/GetAll?limit=${query}`;

    } else if (typeof query === 'string') {

       url = `http://localhost:5022/api/Producto/GetAll?q=${query}`;

    }

    return this.http.get(url);
  }
  // getUserLogged() {
  //   const token = this.getToken();
  //   // Aquí iría el endpoint para devolver el usuario para un token
  // }


  obtenerListCategorias() {
    return this.http.get("http://localhost:5022/api/Categoria/Categoria/GetAll");
  }
}
