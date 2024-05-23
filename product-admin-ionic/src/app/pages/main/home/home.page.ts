import { ref } from 'firebase/storage';
import { Product } from 'src/app/models/product.model';
import { AddUpdateProductComponent } from './../../../shared/components/add-update-product/add-update-product.component';
import { Component, inject, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import {orderBy} from 'firebase/firestore';
import { SellUpdateProductComponent } from 'src/app/shared/components/sell-update-product/sell-update-product.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  products:Product[] = [];
  loading:boolean = false;

  ngOnInit() {
  }

  doRefresh(event){
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }

  ionViewWillEnter(){
    
      this.getProducts();
  
    
  }
  user():User{
    return this.utilsSvc.getLocalStorage('user');
  }

  getProducts(){
    let path = `users/EafwGMgiU7gTn8HkjmkcyfyON2p1/products`;
    console.log(this.user().uid)
    this.loading = true;

    let query = {
      orderBy: 'sell',
      order: 'desc',
    };

    let sub = this.fireBaseSvc.getCollectionData(path,query).subscribe({
      next: (res:any) => {
        this.products = res;

        this.loading = false;

        sub.unsubscribe();
      }
    });
  }

  getProfits(){
    return this.products.reduce((index,product) => index + product.price * product.sell,0);
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

  async confirmDeleteProduct(product:Product){ {
      this.utilsSvc.presentAlert({
        header: 'Eliminar Producto',
        message: '¿Estas seguro de eliminar este producto?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancel',
          }, {
            text: 'si, eliminar',
            handler: () => {
              this.deleteProduct(product)
            }
          }
        ]
      });
    }
  }

   //Eliminar Producto
   async deleteProduct(product:Product){
    if(this.user().uid == 'EafwGMgiU7gTn8HkjmkcyfyON2p1'){
      let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.fireBaseSvc.getFilePath(product.image);
    

    this.fireBaseSvc.deleteDocument(path)
      .then(async res => {

        this.products = this.products.filter(p => p.id !== product.id);
        await this.fireBaseSvc.deleteImage(imagePath)
        this.utilsSvc.presentToast({
          message: 'Producto Eliminado Correctamente',
          duration: 1500,
          position: 'middle',
          icon: 'checkmark-circle-outline',
          color: 'succes'
        });
      })
      .catch(err => {
        this.utilsSvc.presentToast({
          message: 'Error al eliminar el producto',
          duration: 1500,
          position: 'middle',
          icon: 'alert-circle-outline',
          color: 'danger'
        });

      })
      .finally(() => loading.dismiss());
    }
    else{
      this.utilsSvc.presentToast({
        message: 'No puedes eliminar productos',
        duration: 1500,
        position: 'middle',
        icon: 'alert-circle-outline',
        color: 'danger'
      });
    }
    
    }

    //vender Producto
    async sellProduct(product?:Product){ 
      let success = await this.utilsSvc.presentModal({
        component: SellUpdateProductComponent,
        cssClass: 'add-update-modal',
        componentProps: {
          product
        }
      });
  
      if(success) this.getProducts();
    }

    //Nuevo Dia
    async confirmNewDay(){
      this.utilsSvc.presentAlert({
        header: 'Nuevo Dia',
        message: '¿Estas seguro de empezar un nuevo dia?',
        mode: 'ios',
        buttons: [
          {
            text: 'Cancel',
          }, {
            text: 'si, nuevo dia',
            handler: () => {
              this.newDay()
            }
          }
        ]
      });
    }

    async newDay() {
      let path = `users/${this.user().uid}/products`;
  
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      let batch = this.fireBaseSvc.getBatch();
  
      this.products.forEach(product => {
        let productRef = this.fireBaseSvc.getDocumentRef(path, product.id);
        batch.update(productRef, { sell: 0 });
      });
  
      batch.commit()
        .then(async res => {
          await this.getProducts(); // Esperar a obtener productos actualizados
          this.utilsSvc.presentToast({
            message: 'Nuevo Dia Iniciado',
            duration: 1500,
            position: 'middle',
            icon: 'checkmark-circle-outline',
            color: 'succes'
          });
        })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: 'Error al iniciar el nuevo dia',
            duration: 1500,
            position: 'middle',
            icon: 'alert-circle-outline',
            color: 'danger'
          });
        })
        .finally(() => loading.dismiss());
    }
    
    
      
}
