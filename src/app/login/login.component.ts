import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loginUserData: any = {};
  public loginUserForm: FormGroup;
  public error: String = "";
  usersRef: AngularFirestoreCollection;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router, private fs: AngularFirestore) {
    this.createUserForm();
    this.usersRef = fs.collection('users');
  }

  createUserForm() {
    this.loginUserForm = this.fb.group({
      message: ['', Validators.required],
      a: ['', Validators.required],
      b: ['', Validators.required],
    });
  }

login() {
  if(this.loginUserData.email != null && this.loginUserData.password != null) {

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
        if (doc.id == this.loginUserData.email) {
          if (doc.tries < 7) {
            this.userService.login(this.loginUserData.email, this.loginUserData.password)
              .then(() => {
                doc.tries = 0;
                this.usersRef.doc(this.loginUserData.email).update(doc);
                listener.unsubscribe();
                this.router.navigate(['./cifrado']);
              })
              .catch(() => {
                listener.unsubscribe();
                this.error = "El correo electrónico o la contraseña son incorrectos. Si falla un total de 7 veces su cuenta será bloqueada";
                this.userService.loginFail(this.loginUserData.email);
              });
          }
          else {
            listener.unsubscribe();
            this.error = "Su cuenta ha sido bloqueada por intentos fallidos, cmuníquese con el administrador";
          }
        }
      });
    })


    
  }
}



}
