import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  
  

  pages = [
    {
      title: 'Home',
      url: '/main/home',
      icon: 'home-outline'
    },
    {
      title: 'Profile',
      url: '/main/profile',
      icon: 'person'
    },

  ];

  router = inject(Router);
  fireBaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  currentPath = '';
  ngOnInit() {
    this.router.events.subscribe((event:any) => {
      if(event?.url) this.currentPath = event.url;
    });
  }

  user():User{
    return this.utilsSvc.getLocalStorage('user');
  }

  signOut(){
    this.fireBaseSvc.signOut();
    this.utilsSvc.deleteLocalStorage('user');
    this.utilsSvc.routerLink('/auth');
  }
}
