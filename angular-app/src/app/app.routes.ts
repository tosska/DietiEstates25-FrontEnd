import { RouterModule, Routes } from '@angular/router';
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
import { ListingTrackingComponent } from './dashboard/listing-tracking/listing-tracking.component';
import { CustomerMyOffersComponent } from './customer-my-offers/customer-my-offers.component';
import { CustomerListingTrackingComponent } from './customer-my-offers/customer-listing-tracking/customer-listing-tracking.component';
import { AdminAreaComponent } from './admin-area/admin-area.component';
import { ManagerAreaComponent } from './manager-area/manager-area.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NotFoundComponent } from './_error-components/not-found/not-found.component';
import { EditListingComponent } from './dashboard/edit-listing/edit-listing.component';
import { authGuard } from './_guards/auth.guard';
import { NgModule } from '@angular/core';

export const routes: Routes = [


    { path: '404', component: NotFoundComponent },
    // Opzionale: Wildcard per catturare qualsiasi URL sbagliato

    // --- ROTTE PUBBLICHE ---
    { path: "login", component: LoginComponent, title: "Login | DietiEstates App" },
    { path: "signup", component: SignupComponent, title: "Sign up | DietiEstates App" },
    { path: "signup-agency", component: SignupAgencyComponent, title: "Sign up - Agency | DietiEstates App" },
    { path: "logout", component: LogoutComponent, title: "Log out | DietiEstates App" },
    { path: "", redirectTo: "/homepage", pathMatch: 'full' },
    { path: "homepage", component: HomepageComponent, title: "Homepage | DietiEstates App" },
    { path: "listings-page", component: ListingsPageComponent, title: "Listing" },
    { path: "geo-map", component: GeoMapComponent, title: "Geo Map | DietiEstates App" },
    { path: 'listing/:id', component: ListingPageComponent },
    { path: 'unauthorized', component: UnauthorizedComponent, title: "Unauthorized | DietiEstates App" },

    // --- ROTTE PROTETTE (Richiedono solo Login) ---
    {
        path: "user-area",
        component: UserAreaComponent,
        title: "User area | DietiEstates App",
        canActivate: [authGuard] // PROTEZIONE AGGIUNTA
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [authGuard] // PROTEZIONE AGGIUNTA
    },

    // --- ROTTE CUSTOMER (Richiedono Ruolo Customer) ---
    {
        path: 'customer-my-offers',
        component: CustomerMyOffersComponent,
        title: "My Offers | DietiEstates App",
        canActivate: [roleGuard],      // PROTEZIONE AGGIUNTA
        data: { roles: ['customer'] }  // Ruolo richiesto
    },
    {
        path: 'customer-my-offers/listing/:id',
        component: CustomerListingTrackingComponent,
        title: "Listing Tracking | DietiEstates App",
        canActivate: [roleGuard],      // PROTEZIONE AGGIUNTA
        data: { roles: ['customer'] }
    },

    // --- ROTTE AMMINISTRATIVE (Richiedono Admin/Manager) ---
    {
        path: 'admin-area',
        component: AdminAreaComponent,
        title: "Admin Area | DietiEstates App",
        canActivate: [roleGuard],      // PROTEZIONE AGGIUNTA
        data: { roles: ['admin', 'manager'] } // Accessibile a entrambi
    },
    {
        path: 'manager-area',
        component: ManagerAreaComponent,
        title: "Manager Area | DietiEstates App",
        canActivate: [roleGuard],      // PROTEZIONE AGGIUNTA
        data: { roles: ['manager'] }   // Solo Manager
    },

    // --- DASHBOARD AGENTE (Già protetta, ma rivista per coerenza) ---
    {
        path: 'dashboard-agent',
        component: DashboardComponent,
        title: "Dashboard | DietiEstates App",
        canActivate: [roleGuard],
        data: { roles: ['agent'] },
        children: [
            { path: 'create-listing', component: CreateListingPageComponent, title: "Create Listing" },
            { path: 'active-listings', component: ActiveListingsComponent, title: "Active Listings" },
            { 
                path: 'offers-received', 
                component: OffersReceivedComponent, 
                title: "Offers Received",
                children: [] 
            },
            {
                path: 'edit-listing/:id',
                component: EditListingComponent,
                title: "Edit Listing | DietiEstates App"
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
            }, {

                path: 'listing-tracking/:id',
                component: ListingTrackingComponent,
                title: "Listing Tracking | DietiEstates App"
            },
            { path: 'offers-received/listing/:id', component: OffersByListingComponent, title: "Offers by Listing" },
            { path: 'listing-tracking/:id', component: ListingTrackingComponent, title: "Listing Tracking" }
        ]
        
    },
];