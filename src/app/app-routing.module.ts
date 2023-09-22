import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from "./productos/productos.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AddProductosComponent } from "./add-productos/add-productos.component";
import { ProductGridComponent } from "./product-grid/product-grid.component";
import { CarritoComponent } from "./carrito/carrito.component";
import { HistorialComponent } from "./historial/historial.component";


 const appRoutes: Routes = [
  // { path: "", component: AppComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "home", component: HomeComponent },
  { path: "productos", component: ProductosComponent},
  { path: "", component: DashboardComponent},
  { path: "add-productos", component: AddProductosComponent},
  { path: "listaProductos", component: ProductGridComponent},
  { path: "carrito", component: CarritoComponent},
  { path: "historial", component: HistorialComponent},

];

export const routing = RouterModule.forRoot(appRoutes);

