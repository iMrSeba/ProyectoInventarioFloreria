import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  form = new FormGroup({
    id : new FormControl(''),
    name: new FormControl('', [Validators.required]),
    price: new FormControl('', [Validators.required]),
    stock: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  })

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {
  }

  async takeImage() {
    const image = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(image);
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.fireBaseSvc.signUp(this.form.value as User)
        .then(async res => {
          let uid = res.user.uid;
          await this.fireBaseSvc.updateUser(this.form.value.name);
        })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: 'Error al registrarte,correo ya existe',
            duration: 2500,
            position: 'middle',
            icon: 'alert-circle-outline',
            color: 'danger'
          });

        })
        .finally(() => loading.dismiss());
    }
  }


}
