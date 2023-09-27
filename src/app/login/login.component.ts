import { Component } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import Swal from 'sweetalert2';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  nombre: string ='';

  constructor(private userService: UsersService, private router: Router, private cookieService: CookieService) {}
  ngOnInit() {
    // Verifica si la cookie "user" existe
    const userCookie = this.cookieService.get("user");

    if(userCookie){
      this.router.navigateByUrl("/");
    }

  }
  login() {
    // Verifica si los campos están vacíos o el correo tiene un formato incorrecto
    if (!this.email || !this.password || !this.validateEmail(this.email)) {
      this.showAlert('Por favor, ingrese un correo electrónico válido y complete todos los campos.');
      return; // No continúes con la solicitud de inicio de sesión
    }

    const user = { correo: this.email, password: this.password };

    this.userService.login(user).subscribe(
      (data: any) => {
        if (data) {
          this.cookieService.set("user", JSON.stringify(data));
          this.router.navigateByUrl("/");
        }
      },
      (error) => {
        console.log("Error en la autenticación:", error);

        if (error.status === 404) {
          this.showAlert('Usuario no encontrado en la base de datos.');
        } else {
          this.showAlert('Ocurrió un error durante la autenticación. Por favor, intente nuevamente.');
        }
      }
    );
  }
  validateEmail(email: string): boolean {
    // Utilizamos una expresión regular para validar el formato del correo electrónico
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  showAlert(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      timer: 3000,
      showConfirmButton: false
    });
  }

}
