import { inject } from "@angular/core";
import { HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { AuthService } from "../_services/auth/auth.service";

// Interceptor to add the Authorization header with the token to the request

const excludedDomains = ['api.geoapify.com'];

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const authService = inject(AuthService);
    const token = authService.getToken();

    //appena trova un elemento contenuto nel url della richiesta, esclude l'aggiunta del token
    if (excludedDomains.some(domain => request.url.includes(domain))) {
        return next(request);
    }

    if (token) {
        // Clone the request and add the Authorization header with the token
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer ' + token
            }
        });
    }

    return next(request);
}