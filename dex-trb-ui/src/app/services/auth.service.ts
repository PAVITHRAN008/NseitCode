import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedUser!: boolean;

  constructor() { }

  setIsAuthenticatedUser(canUserLogin: boolean) {
    this.isAuthenticatedUser = canUserLogin;
  }

  getIsAuthenticatedUser(): boolean {
    return this.isAuthenticatedUser;
  }
}
