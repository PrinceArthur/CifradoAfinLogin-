import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersRef: AngularFirestoreCollection;

  constructor(private auth: Auth, private fs: AngularFirestore) {
    this.usersRef = fs.collection('users');
   }

  login(email: any, password: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginFail(email: any) {

    let listener = this.usersRef.snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        const tries = a.payload.doc.data()['tries'];
        return { id, tries, ...data };
      }))
    ).subscribe(docs => {
      docs.forEach(doc => {
        console.log(doc.tries);
        if (doc.id == email) {
          doc.tries = doc.tries + 1;
          this.usersRef.doc(email).update(doc);
          listener.unsubscribe();
        }
      });
    })

  }

  logout() {
    return signOut(this.auth);
  }

}
