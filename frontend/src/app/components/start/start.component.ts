import { Component } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  constructor(public routerService: RouterService) { }

  start() {

  }
}
