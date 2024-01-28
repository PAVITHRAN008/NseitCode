import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }
  private isAuthorized(route: ActivatedRouteSnapshot): boolean {
    let roles = ['SME','Admin'];
    let exceptedRoles = route.data['exceptedRoles'];
    let roleMatches = roles.findIndex(role => exceptedRoles.indexOf(role) !== -1)
    return (roleMatches >= 0) ? true : false
  }

}
