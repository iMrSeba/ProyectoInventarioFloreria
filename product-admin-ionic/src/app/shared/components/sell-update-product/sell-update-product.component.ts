import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sell-update-product',
  templateUrl: './sell-update-product.component.html',
  styleUrls: ['./sell-update-product.component.scss'],
})
export class SellUpdateProductComponent  implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    sell: new FormControl(null, [Validators.required]),
    stock: new FormControl(null),
  });

  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;
  ngOnInit() {
    this.user = this.utilsSvc.getLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  setNumberInputs(){
    let {sell, stock} = this.form.controls;

    if (sell.value) sell.setValue(parseFloat(sell.value));
    if (stock.value) stock.setValue(parseFloat(stock.value));
  }

  submit(){
    if (this.form.valid){
      this.UpdateProduct();
    }
    else{
      this.utilsSvc.presentToast({
        message: 'Ingrese cantidad vendida',
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
    this.form.controls.stock.setValue(this.product.stock - this.form.value.sell);
    this.form.controls.sell.setValue(this.form.value.sell + this.product.sell);

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
