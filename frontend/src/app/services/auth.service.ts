import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private readonly authDataKey = 'authData';

  // Sauvegarder les données dans le localStorage
  saveAuthData(data: any) {
    localStorage.setItem(this.authDataKey, JSON.stringify(data));
  }

  // Récupérer authData depuis LocalStorage
  getAuthData(): any {
    const data = localStorage.getItem(this.authDataKey);
    return data ? JSON.parse(data) : null; // Retourne null si aucune donnée
  }

  // Vérifier si authData existe dans LocalStorage
  hasAuthData(): boolean {
    return !!this.getAuthData(); // Renvoie true si authData existe, false sinon
  }

  // Supprimer les données
  clearAuthData() {
    localStorage.removeItem(this.authDataKey);
  }

  // Obtenir uniquement l'access token
  getAccessToken() {
    const authData = this.getAuthData();
    return authData.access || null;
  }

  // Obtenir uniquement le refresh token
  getRefreshToken() {
    const authData = this.getAuthData();
    return authData.refresh || null;
  }
}

