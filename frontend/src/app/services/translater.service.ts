import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TranslaterService {

  constructor(public translate: TranslateService) {

    translate.setDefaultLang(this.getDefaultLanguage())
  }

  changeLanguage(lang: string) {
    this.translate.use(lang)
    localStorage.setItem('language', lang);
  }

  getDefaultLanguage() {
    const language: any = localStorage.getItem('language')
    console.log(language)
    if (!language) {
      localStorage.setItem('language', 'en');
      return 'en'
    }
    return language
  }
}
