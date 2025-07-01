import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        title: "Login | DietiEstates Angular App"
    }, {
        path: "signup",
        component: SignupComponent,
        title: "Sign up | DietiEstates Angular App"
    }, {
        path: "logout",
        component: LogoutComponent,
        title: "Log out | DietiEstates Angular App"
    }, {
        path: "",
        redirectTo: "/signup",
        pathMatch: 'full'
    },
];
