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
    const user = { correo: this.email, password: this.password };
    console.log("Este anda");
  
    this.userService.login(user).subscribe(
      (data: any) => {
        console.log("Respuesta recibida:", data);
  
        // Aquí puedes realizar otras acciones en función de la respuesta del servicio
        if (data) {
          // Realiza acciones basadas en los datos de respuesta, pero no esperes un token
          // Por ejemplo, redirige al usuario a una página de inicio o muestra un mensaje de éxito.
          this.router.navigateByUrl("/home");
        } else {
          console.log("No se encontraron datos relevantes en la respuesta.");
        }
      },
      (error) => {
        console.log("Error en la autenticación:", error);
      }
    );
  }
  
}
