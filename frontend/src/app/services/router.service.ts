import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private router: Router) { }

  routeRoute(route: string) {
    this.router.navigate([route]);
  }
  routeRouteWithParams(route: string, view1: number, view2: number) {
    this.router.navigate([route], { queryParams: { view1: view1, view2: view2 } });
  }
}
