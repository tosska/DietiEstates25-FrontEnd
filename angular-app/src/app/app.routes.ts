import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { HomepageComponent } from './homepage/homepage.component';
import { SignupAgencyComponent } from './signup-agency/signup-agency.component';
import { ListingsPageComponent } from './listings-page/listings-page.component';
import { GeoMapComponent } from './geo-map/geo-map.component';
import { UserAreaComponent } from './user-area/user-area.component';
import { ListingPageComponent } from './listing-page/listing-page.component';

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
        path: "user-area",
        component: UserAreaComponent,
        title: "User area | DietiEstates Angular App"
    }, {
        path: "signup-agency",
        component: SignupAgencyComponent,
        title: "Sign up - Agency | DietiEstates Angular App"
    }, {
        path: "logout",
        component: LogoutComponent,
        title: "Log out | DietiEstates Angular App"
    }, {
        path: "",
        redirectTo: "/homepage",
        pathMatch: 'full'
    }, {
        path: "homepage",
        component: HomepageComponent,
        title: "Homepage | DietiEstates Angular App"
    }, {
        path: "listings-page",
        component: ListingsPageComponent,
        title: "Listing"
    },  {
        path: "geo-map",
        component: GeoMapComponent,
        title: "Geo Map | DietiEstates Angular App"
    }, {
        path: 'listing/:id', 
        component: ListingPageComponent 
    }
];
