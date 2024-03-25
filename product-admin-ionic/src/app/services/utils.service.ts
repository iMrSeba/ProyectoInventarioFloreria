import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  //====================Loading====================
  loading() {
    return this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'crescent'
    });
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //====================Navegacion====================
  routerLink(url: string) {
    this.router.navigateByUrl(url);
  }

  //=====================Save local storage====================

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  //=====================Get local storage====================
  getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
}
