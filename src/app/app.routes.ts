import { Routes } from '@angular/router';
import { HomeComponent } from './components/vistaPrincipal/home/home.component';
import { ReservacionesComponent } from './components/vistaReservaciones/reservaciones/reservaciones.component';
import { InstalacionesComponent } from './components/vistaInstalaciones/instalaciones/instalaciones.component';
import { ActividadesComponent } from './components/vistaActividades/actividades/actividades.component';
import { ActividadComponent } from './components/vistaActividades/actividad/actividad.component';
import { AcercaComponent } from './components/vistaAcerca/acerca/acerca.component';
import { BuscarComponent } from './components/vistaActividades/buscar/buscar.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { ListaContactosComponent } from './components/lista-contactos/lista-contactos.component';
import { ContenedorComponent } from './components/VistaDesarrolladores/contenedor/contenedor.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'reservaciones', component: ReservacionesComponent},
    {path: 'instalaciones', component: InstalacionesComponent},
    {path: 'actividades', component: ActividadesComponent},
    {path: 'actividad/:id', component: ActividadComponent},
    {path: 'acerca', component: AcercaComponent},
    {path: 'buscador/:nombre', component: BuscarComponent},
    {path: 'tab', component: ReservationsComponent},
    {path: 'contact', component: ListaContactosComponent},
    {path: 'desa', component: ContenedorComponent}
];
