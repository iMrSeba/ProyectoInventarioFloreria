import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  getFromLocalStorage(arg0: string): import("src/app/models/user.model").User {
    throw new Error('Method not implemented.');
  }

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  

  async takePicture (promptLabelHeader:string){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto:'selecciona una imagen',
      promptLabelPicture:'tomar una foto',
    });
  };

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

  //=================== Modal ===================
  async presentModal(otps: ModalOptions) {
    const modal = await this.modalCtrl.create(otps);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      return data;
    } else {
      return null; // Devuelve null si no hay datos
    }
}

  dismissModal(data?: any) {
    this.modalCtrl.dismiss(data);
  }
}
