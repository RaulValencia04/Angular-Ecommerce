import { Component } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  nombre: string ='';

  constructor(private userService: UsersService, private router: Router) {}

  login() {
    const user = {nombre_usuario:this.nombre, correo: this.email, password: this.password }; // Usar 'correo' en lugar de 'email' para coincidir con el nombre de columna en la tabla 'usuarios'
    console.log(user);
    this.userService.login(user).subscribe(



      (data: any) => {
        // Supongamos que el servicio devuelve un objeto con un token
        if (data && data.token) {
          // Almacena el token en el servicio o en localStorage
          this.userService.setToken(data.token);
          console.log(data.token)
          this.router.navigateByUrl("/home");
        } else {
          console.log("Token no encontrado en la respuesta.");
        }
      },
      (error) => {
        console.log("Error en la autenticación:", error);
      }
    );
  }
}
