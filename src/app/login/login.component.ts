import { Component } from "@angular/core";
import { UsersService } from "../users/users.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

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
    const user = { correo: this.email, password: this.password };


    this.userService.login(user).subscribe(
      (data: any) => {

        // Aquí puedes realizar otras acciones en función de la respuesta del servicio
        if (data) {

          // Realiza acciones basadas en los datos de respuesta, pero no esperes un token
          // Por ejemplo, redirige al usuario a una página de inicio o muestra un mensaje de éxito.
          this.cookieService.set("user", JSON.stringify(data));
          this.router.navigateByUrl("/");
        } 
      },
      (error) => {
        console.log("Error en la autenticación:", error);
      }
    );
  }

}
