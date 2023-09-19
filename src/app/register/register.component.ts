import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router"; // Importa el Router
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit  {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phoneNumber: string = "";
  address: string = "";
  password: string = "";
  confirmPassword: string = "";

  constructor(public userService: UsersService, private router: Router, private cookieService: CookieService ) {}

  ngOnInit() {
    // Verifica si la cookie "user" existe
    const userCookieExists = this.cookieService.check("user");

    if (userCookieExists) {
      // Si la cookie no existe, redirige a la página de inicio de sesión
      this.router.navigateByUrl("/");
    }
  }

  register() {
    const user = {
      nombre_usuario: this.firstName, // Update property names based on the response body
      apellido_usuario: this.lastName,
      correo: this.email,
      telefono: this.phoneNumber,
      direccion: this.address,
      password: this.password,
    };

    this.userService.register(user).subscribe(
      (data: any) => {
        // Assuming data.token exists in the response
        if (data.token) {
          this.userService.setToken(data.token);
          this.router.navigateByUrl("/");
        } else {
          console.log("Token not found in response.");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
