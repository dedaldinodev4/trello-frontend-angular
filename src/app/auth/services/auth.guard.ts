import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Router } from '@angular/router'
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){}
  
  canActivate(): Observable<boolean> {
    return this.authService.isLogged$.pipe(
      map( (isLoggedIn) => {
        if(isLoggedIn) {
          return true;
        }
        this.router.navigateByUrl('/');
        return false;
      })
    )
  }
  
}
