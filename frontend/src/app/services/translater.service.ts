import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslaterService {

  constructor(public translate: TranslateService) {
    translate.setDefaultLang('en')
  }

  changeLanguage(lang: string) {
    this.translate.use(lang)
  }
}
