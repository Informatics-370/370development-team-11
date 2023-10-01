import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuditLog } from '../Shared/AuditLog';
import { DataService } from './data-service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'; // Ionic storage for session management
import { NavController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    log: AuditLog = {
        log_ID: 0,
        user: "",
        action: "",
        actionTime: new Date(),
    }

    private tokenExpirationTimer: any;

    constructor(private router: Router, private dataService: DataService, private http: HttpClient, private storage: Storage, private navController: NavController) { this.init() }

    private userRoleSubject = new BehaviorSubject<string>(null);
    userRole$ = this.userRoleSubject.asObservable();

    async init() {
        await this.storage.create();
    }

    setUserRole(role: string) {
        this.userRoleSubject.next(role);
        console.log(this.userRole$)
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
    async isLoggedIn(): Promise<boolean> {
        const token = await this.storage.get('token');
        const tokenExpiration = await this.storage.get('tokenExpiration');
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

    async logout(): Promise<void> {

        let token = await this.storage.get("token");
        this.log.action = "Force logged out of the system due to inactivity";
        this.log.user = this.dataService.decodeUser(token);
        let test: any
        test = new DatePipe('en-ZA');
        this.log.actionTime = test.transform(this.log.actionTime, 'MMM d, y, h:mm:ss a');
        this.dataService.AuditLogAdd(this.log).subscribe({
            next: (Log) => {
                this.storage.remove('token');
                this.storage.remove('tokenExpiration');
                this.navController.navigateForward(['']);
            }
        })

    }

    private async resetTokenExpirationTimer(): Promise<void> {
        const tokenExpiration = await this.storage.get('tokenExpiration');
        const expirationTime = parseInt(tokenExpiration, 10);

        const expiresInMs = expirationTime - new Date().getTime();
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiresInMs);
    }
}
