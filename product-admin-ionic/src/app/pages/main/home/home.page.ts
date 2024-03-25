import { AddUpdateProductComponent } from './../../../shared/components/add-update-product/add-update-product.component';
import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  //Cerrar sesion
  signOut(){
    this.fireBaseSvc.signOut();
  }

  //======== Agregar o actualizar producto =========
  addUpdateProduct(){ 
    this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal'
    });
  }

}
