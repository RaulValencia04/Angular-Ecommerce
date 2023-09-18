import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from "./productos/productos.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

 const appRoutes: Routes = [
  // { path: "", component: AppComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "home", component: HomeComponent },
  { path: "productos", component: ProductosComponent},
  { path: "", component: DashboardComponent},
];

export const routing = RouterModule.forRoot(appRoutes);

