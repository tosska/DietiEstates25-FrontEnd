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
import { CreateListingPageComponent } from './create-listing-page/create-listing-page.component';
import { roleGuard } from './_guards/role.guard';
import { UnauthorizedComponent } from './_error-components/unauthorized/unauthorized.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActiveListingsComponent } from './dashboard/active-listings/active-listings.component';
import { OffersReceivedComponent } from './dashboard/offers-received/offers-received.component';
import { OffersByListingComponent } from './dashboard/offers-received/offers-by-listing/offers-by-listing.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent,
        title: "Login | DietiEstates App"
    }, {
        path: "signup",
        component: SignupComponent,
        title: "Sign up | DietiEstates App"
    }, {
        path: "user-area",
        component: UserAreaComponent,
        title: "User area | DietiEstates App"
    }, {
        path: "signup-agency",
        component: SignupAgencyComponent,
        title: "Sign up - Agency | DietiEstates App"
    }, {
        path: "logout",
        component: LogoutComponent,
        title: "Log out | DietiEstates App"
    }, {
        path: "",
        redirectTo: "/homepage",
        pathMatch: 'full'
    }, {
        path: "homepage",
        component: HomepageComponent,
        title: "Homepage | DietiEstates App"
    }, {
        path: "listings-page",
        component: ListingsPageComponent,
        title: "Listing"
    }, {
        path: "geo-map",
        component: GeoMapComponent,
        title: "Geo Map | DietiEstates App"
    }, {
        path: 'listing/:id',
        component: ListingPageComponent
    }, {
        path: 'dashboard-agent',
        component: DashboardComponent,
        title: "Dashboard | DietiEstates App",
        canActivate: [roleGuard],
        data: { roles: ['agent'] },
        children: [

            {
                path: 'create-listing',
                component: CreateListingPageComponent,
                title: "Create Listing | DietiEstates App"
            },
            {
                path: 'active-listings',
                component: ActiveListingsComponent,
                title: "Active Listings | DietiEstates App"
            },
            {
                path: 'offers-received',
                component: OffersReceivedComponent,
                title: "Offers Received | DietiEstates App",
                children: [

                ]
            }, {

                path: 'offers-received/listing/:id',
                component: OffersByListingComponent,
                title: "Offers by Listing | DietiEstates App"


            }
        ]
    }, {
        path: 'unauthorized',
        component: UnauthorizedComponent,
        title: "Unauthorized | DietiEstates App"
    },
];
