import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private tokenExpirationTimer: any;

    constructor(private router: Router) { }

    private userRoleSubject = new BehaviorSubject<string>(null);
    userRole$ = this.userRoleSubject.asObservable();


    setUserRole(role: string) {
        this.userRoleSubject.next(role);
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // Check if the user is logged in
        if (this.isLoggedIn()) {
            // User is logged in, allow access to the route
            return true;
        } else {
            // User is not logged in, redirect to the login page
            this.router.navigate(['/login']);
            return false;
        }
    }
    isLoggedIn(): boolean {
        const token = sessionStorage.getItem('token');
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        if (token && tokenExpiration) {
            const now = new Date().getTime();
            const expirationTime = parseInt(tokenExpiration, 10);

            if (now < expirationTime) {

                this.resetTokenExpirationTimer();
                return true;
            }
        }

        this.logout();
        return false;
    }

    logout(): void {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiration');
        this.router.navigate(['']);
    }

    private resetTokenExpirationTimer(): void {
        const tokenExpiration = sessionStorage.getItem('tokenExpiration');
        const expirationTime = parseInt(tokenExpiration, 10);

        const expiresInMs = expirationTime - new Date().getTime();
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresInMs);
    }
}
