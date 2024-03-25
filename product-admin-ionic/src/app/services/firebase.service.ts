import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth';
import {User} from '../models/user.model';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {getFirestore,doc,setDoc,getDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);

  //====================Autenficacion====================




  //=========Acceder=========================
  signIn(user:User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=========Acceder=========================
  signUp(user:User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //=========Actualizar Perfil=========================
  updateUser(displayName:string){
    return updateProfile(getAuth().currentUser, {
      displayName
    });
  }

  //Base de datos
  
  setDocument(path:string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }

  async getDocument(path:string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
