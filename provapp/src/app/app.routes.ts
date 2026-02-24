import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
{ path: '', component: Home },
{ path: 'profile', component: Profile, canActivate: [authGuard] },
{ path: '**', redirectTo: '' },
];
