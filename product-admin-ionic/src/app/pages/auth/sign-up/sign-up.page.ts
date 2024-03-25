import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required])
  })

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.fireBaseSvc.signUp(this.form.value as User)
        .then(async res => {
          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);
          this.setUserInfo(uid);
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

  async setUserInfo(uid: string) {
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();


      let path = `users/${uid}`;
      delete this.form.value.password;

      this.fireBaseSvc.setDocument(path, this.form.value).then(res => {
        this.utilsSvc.setLocalStorage('user', this.form.value);
        this.utilsSvc.routerLink('/main/home');
      })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: 'Error al guardar en la base de datos',
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
