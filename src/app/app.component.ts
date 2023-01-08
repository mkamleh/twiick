import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


import { Platform } from '@ionic/angular';
import { Plugins, Capacitor, AppState } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
declare let fbq:Function;


//import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;
  private zone: NgZone;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private ngZone:NgZone,
    private firebasee:AngularFireAuth

  ) {
    router.events.subscribe((y: NavigationEnd) => {
      if(y instanceof NavigationEnd){
        fbq('track', 'PageView');
      }
    })
    //this.initializeApp();
  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     if (Capacitor.isPluginAvailable('SplashScreen')) {
  //       Plugins.SplashScreen.hide();
  //     }
  //   });
  // }

  isClicked = false;


  ngOnInit() {
    firebase.initializeApp(environment.firebaseConfig);

    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {

        this.ngZone.run(()=> this.router.navigateByUrl('/auth'));
      }
      this.previousAuthState = isAuth;
    });

    Plugins.App.addListener(
      'appStateChange',
       this.checkAuthOnResume.bind(this)
     );
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    //Plugins.App.removeListener('appStateChange', this.checkAuthOnResume);
  }

  menuClicked(){
    this.isClicked = !this.isClicked;
    //console.log("pressed");
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            //this.onLogout();
          }
        });
    }
  }
}
