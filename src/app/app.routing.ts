import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { UserComponent } from './user';
import { LoginComponent } from './login';
import { AuthGuard } from './_guards';

export const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always' },
    { path: 'login', component: LoginComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);