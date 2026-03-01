import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/auth.service';
import { ListaSpesa } from './pages/lista-spesa/lista-spesa';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'spesa', component: ListaSpesa, canActivate: [authGuard] },
    { path: '**', redirectTo: '' },
];