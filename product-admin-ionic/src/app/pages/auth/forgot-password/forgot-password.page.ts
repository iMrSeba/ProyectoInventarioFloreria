import { sendPasswordResetEmail } from 'firebase/auth';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
})

fireBaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);
ngOnInit() {
}

async submit(){
  if(this.form.valid){

    const loading = await this.utilsSvc.loading();
    await loading.present();
    
    this.fireBaseSvc.resetPassword(this.form.value.email)
    .then(res => {
      this.utilsSvc.presentToast({
        message: 'Correo de recuperación de contraseña enviado con éxito',
        duration: 2500,
        position: 'middle',
        icon: 'mail-outline',
        color: 'primary'
      });
      this.utilsSvc.routerLink('/auth');
      this.form.reset();
    })
    .catch(err => {
      this.utilsSvc.presentToast({
        message: 'Error al enviar correo de recuperación de contraseña',
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
