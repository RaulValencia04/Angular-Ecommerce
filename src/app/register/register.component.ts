import { Component, OnInit } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router"; // Importa el Router
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  email: string = "";
  phoneNumber: string = "";
  address: string = "";
  password: string = "";
  confirmPassword: string = "";

  MatchPassword: string = '';

  formSubmitted = false;

  constructor(public userService: UsersService, private router: Router, private cookieService: CookieService) { }

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
      nombre_usuario: this.firstName,
      apellido_usuario: this.lastName,
      correo: this.email,
      telefono: this.phoneNumber,
      direccion: this.address,
      password: this.password,
    };
  
    const camposVacios = []; // Array para almacenar los nombres de los campos vacíos
  
    // Verificar cada campo y agregar al array si está vacío
    if (user.nombre_usuario.length === 0) {
      camposVacios.push('First Name');
    }
    if (user.apellido_usuario.length === 0) {
      camposVacios.push('Last Name');
    }
    if (user.correo.length === 0) {
      camposVacios.push('Email');
    }
    if (user.direccion.length === 0) {
      camposVacios.push('Address');
    }
    if (user.telefono.length === 0) {
      camposVacios.push('Phone Number');
    }
    if (user.password.length === 0) {
      camposVacios.push('Password');
    }
    
    if (user.password !== this.confirmPassword) {
      // Contraseñas no coinciden, mostrar un mensaje de error
      this.MatchPassword = 'Las contraseñas no coinciden';
      return;  // Detener el proceso de registro
    } else {
      this.MatchPassword = '';  // Limpiar el mensaje de error si coincide
    }
  
    if (camposVacios.length === 0) {
      // Todos los campos están llenos, proceder con el registro
      this.userService.register(user).subscribe(
        (data: any) => {
          if (data.token) {
            this.userService.setToken(data.token);
            this.router.navigateByUrl("/");
          } else {
            console.log("Token not found in response.");
          }
          
          this.router.navigateByUrl("/login");
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // Al menos un campo está vacío, puedes mostrar un mensaje o hacer lo que necesites
      console.log('Campos vacíos:', camposVacios);
      // Aquí podrías mostrar un mensaje al usuario indicando los campos que están vacíos
    }
  }

  
  
}
