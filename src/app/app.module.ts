import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app-routing.module'; // Importa el módulo de rutas
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductosComponent } from './productos/productos.component';
import { AddProductosComponent } from './add-productos/add-productos.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductGridComponent } from './product-grid/product-grid.component';
import { CarritoComponent } from './carrito/carrito.component';
import { HistorialComponent } from './historial/historial.component';
import { OfertarComponent } from './ofertar/ofertar.component';
import { RouterModule } from '@angular/router';
import { FacturaComponent } from './factura/factura.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, HomeComponent, NavbarComponent, ProductosComponent, AddProductosComponent, DashboardComponent, ProductGridComponent, CarritoComponent, HistorialComponent, OfertarComponent, FacturaComponent],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule ,
    // Importa el AppRoutingModule que contiene tus rutas
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],

})
export class AppModule {}
