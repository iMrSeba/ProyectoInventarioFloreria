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
}
