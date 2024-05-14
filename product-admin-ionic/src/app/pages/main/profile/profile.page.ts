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
    
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Perfil')).dataUrl;

    let imagePath = `${user.uid}/${Date.now()}`;
    let imageUrl = await this.fireBaseSvc.uploadImage(imagePath,dataUrl);
  }


}
