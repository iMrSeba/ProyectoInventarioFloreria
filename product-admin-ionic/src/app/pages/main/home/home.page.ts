import { Product } from 'src/app/models/product.model';
import { AddUpdateProductComponent } from './../../../shared/components/add-update-product/add-update-product.component';
import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
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
  products:Product[] = [];

  ngOnInit() {
  }

  user():User{
    return this.utilsSvc.getLocalStorage('user');
  }

  ionViewWillEnter(){
    this.getProducts();
  }

  getProducts(){
    let path = `users/${this.user().uid}/products`;
    let sub = this.fireBaseSvc.getCollectionData(path).subscribe({
      next: (res:any) => {
        this.products = res;
        sub.unsubscribe();
      }
    });
  }

  //Cerrar sesion
  signOut(){
    this.fireBaseSvc.signOut();
  }

  //======== Agregar o actualizar producto =========
  async addUpdateProduct(product?:Product){ 
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {
        product
      }
    });

    if(success) this.getProducts();
  }

}
