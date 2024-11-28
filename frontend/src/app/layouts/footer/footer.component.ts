import { Component } from '@angular/core';
import { RouterService } from 'src/app/services/router.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  constructor(public routerService: RouterService) { }
}
