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
  router: any;

  constructor(public userService: UsersService) {}

  login() {
    const user = { email: this.email, password: this.password };
    this.userService.login(user).subscribe(data => {
      this.userService.setToken(data.token);
      this.router.navigateByUrl("/");
    },
    error => {
      console.log(error);
    });
  }
}

