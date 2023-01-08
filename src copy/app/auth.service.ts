
import { ShoppingCartService } from './checkout-cart/shopping-cart.service';
import { Injectable, NgZone } from '@angular/core';
import { identifierModuleUrl } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { User } from './user.model';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';

interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userIdd = "2322";
  private _user = new BehaviorSubject<User>(null);


  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  createNewUserId(){

  }

  getuseridd(){
    return this._user.asObservable();
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

 checkIfAdminOrNot(userId) {
    return this.httpClinet.get(`https://twiick-default-rtdb.firebaseio.com/users/${userId}/role.json`).pipe(
      map(role => {
        //console.log(role,"role");
        if (role === "admin") {
          return true;
        } else {
          return false;
        }
      })
    );
  }



  constructor(private ngZone:NgZone, private httpClinet:HttpClient,private router: Router) { }

  // getUserId(){
  //   return this.userIdd;
  // }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          //console.log('nostorage');
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

  signup(email:string, password: string){
    return this.httpClinet.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIkey}`,
    {email:email, password:password, returnSecureToken: true})
    .pipe(tap(this.setUserData.bind(this)));

  }

  login(email:string, password: string){
    return this.httpClinet.post<AuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIkey}`,
    {email:email, password:password, returnSecureToken: true})
    .pipe(tap(this.setUserData.bind(this)));;

  }

  logout() {
    this._user.next(null);
    Plugins.Storage.remove({ key: 'authData' });

   this.ngZone.run(()=> this.router.navigateByUrl('/'));
  }

  addUserToMyDatabase(id:string, name:string, number: number, email:string){
    return this.httpClinet.put(`https://twiick-default-rtdb.firebaseio.com/users/${id}.json`,{name:name,number:number,id:id, role: "customer", email: email});
  }

  private setUserData(userData: AuthResponse) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email
    );
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const data = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({ key: 'authData', value: data });
  }
}
