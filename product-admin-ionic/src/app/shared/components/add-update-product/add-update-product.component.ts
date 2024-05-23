import { SellUpdateProductComponent } from './../sell-update-product/sell-update-product.component';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id : new FormControl(''),
    name: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    stock: new FormControl(null, [Validators.required]),
    sell: new FormControl(null),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  })

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  ngOnInit() {
    this.user = this.utilsSvc.getLocalStorage('user');
    if(this.product) this.form.setValue(this.product);
  }

  async takeImage() {
    const image = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(image);
  }

  setNumberInputs(){
    let {sell, stock,price} = this.form.controls;

    if (sell.value) sell.setValue(parseFloat(sell.value));
    if (stock.value) stock.setValue(parseFloat(stock.value));
    if (price.value) price.setValue(parseFloat(price.value));
  }

  submit() {
    if (this.form.valid) {
      if(this.product) this.UpdateProduct(); 
      else this.CreateProduct();
    } 
  }

  //Crear producto
  async CreateProduct() {
      if(this.user.uid == "EafwGMgiU7gTn8HkjmkcyfyON2p1"){
        let path = `users/${this.user.uid}/products`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.fireBaseSvc.uploadImage(imagePath,dataUrl);
      this.form.controls.image.setValue(imageUrl);
      this.form.controls.sell.setValue(0);

      delete this.form.value.id;
      this.fireBaseSvc.addDocument(path,this.form.value)
        .then(async res => {

          this.utilsSvc.dismissModal({succes:true})
          this.utilsSvc.presentToast({
            message: 'Producto Agregado Correctamente',
            duration: 1500,
            position: 'middle',
            icon: 'checkmark-circle-outline',
            color: 'succes'
          });
        })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: 'Error al crear el producto',
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
          message: 'No puedes agregar productos',
          duration: 1500,
          position: 'middle',
          icon: 'alert-circle-outline',
          color: 'danger'
        });
      }
      
  }

  //Actualizar Producto
  async UpdateProduct() {
      
      let path = `users/${this.user.uid}/products/${this.product.id}`;

      const loading = await this.utilsSvc.loading();
      await loading.present();

      if(this.form.value.image !== this.product.image){
        let dataUrl = this.form.value.image;
        let imagePath = await this.fireBaseSvc.getFilePath(this.product.image);
        let imageUrl = await this.fireBaseSvc.uploadImage(imagePath,dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }
      
      delete this.form.value.id;
      this.fireBaseSvc.updateDocument(path,this.form.value)
        .then(async res => {

          this.utilsSvc.dismissModal({succes:true})
          this.utilsSvc.presentToast({
            message: 'Producto Actualizado Correctamente',
            duration: 1500,
            position: 'middle',
            icon: 'checkmark-circle-outline',
            color: 'succes'
          });
        })
        .catch(err => {
          this.utilsSvc.presentToast({
            message: 'Error al crear el producto',
            duration: 1500,
            position: 'middle',
            icon: 'alert-circle-outline',
            color: 'danger'
          });

        })
        .finally(() => loading.dismiss());
  }
}
