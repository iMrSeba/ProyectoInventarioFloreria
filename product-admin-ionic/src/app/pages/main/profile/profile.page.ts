import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  user():User{
    return this.utilsSvc.getLocalStorage('user');
  }

  async takeImage() {

    let user = this.user();
    let path = `users/${user.uid}`;

    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil')).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    let imagePath = `${user.uid}/profile`;
    user.image = await this.fireBaseSvc.uploadImage(imagePath,dataUrl);

    this.fireBaseSvc.updateDocument(path,{image: user.image})
        .then(async res => {

          this.utilsSvc.setLocalStorage('user',user);
          this.utilsSvc.presentToast({
            message: 'Imagen Actualizada Correctamente',
            duration: 1500,
            position: 'middle',
            icon: 'checkmark-circle-outline',
            color: 'succes'
          });
        })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: 'Error al actualizar la imagen',
            duration: 1500,
            position: 'middle',
            icon: 'alert-circle-outline',
            color: 'danger'
          });

        })
        .finally(() => loading.dismiss());
  }


}
