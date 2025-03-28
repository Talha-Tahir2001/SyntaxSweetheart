import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'generate',
        loadComponent: () => import('./pages/generate/generate.component').then(m => m.GenerateComponent),
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    },
    {
        path: '**', 
        redirectTo: ''
    }
];
