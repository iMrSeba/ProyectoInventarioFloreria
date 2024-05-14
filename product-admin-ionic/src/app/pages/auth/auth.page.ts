import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  ngOnInit() {
  }

  async submit(){
    if(this.form.valid){

      
      this.fireBaseSvc.signIn(this.form.value as User)
      .then(res => {
        this.getUserInfo(res.user.uid);
      })
      .catch(err => {
        this.utilsSvc.presentToast({
          message: 'Error al iniciar sesión',
          duration: 2500,
          position: 'middle',
          icon: 'alert-circle-outline',
          color: 'danger'
        });
      
      })
    }
  }

  async getUserInfo(uid:string){
    if(this.form.valid){
  
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
     
      let path = `users/${uid}`;
  
      this.fireBaseSvc.getDocument(path).then((user:User) => {
        this.utilsSvc.setLocalStorage('user',user);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();
        this.utilsSvc.presentToast({
          message: `Bienvenido a la aplicación ${user.name}`,
          duration: 2500,
          position: 'middle',
          icon: 'person-circle-outline',
          color: 'primary'
        });
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
