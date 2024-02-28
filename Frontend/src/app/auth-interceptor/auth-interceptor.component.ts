import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-interceptor',
  templateUrl: './auth-interceptor.component.html',
  styleUrls: ['./auth-interceptor.component.css']
})
@Injectable()
export class AuthInterceptorComponent implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from localStorage
    if (localStorage.getItem('token')) {
      const JWT = JSON.parse(localStorage.getItem('token'));
      const token = JWT.token;

      const cloned = request.clone({
        headers: request.headers.set("Authorization",
          "Bearer " + token)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(request);
    }

  }

}
