import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from 'selenium-webdriver/http';

import { CatagoriesService } from '../catagories.service';
import { AuthService } from '../auth.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuServiceService } from '../menu-service.service';
import { NumberConfirmationModalComponent } from './number-confirmation-modal/number-confirmation-modal.component';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';



@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  isLogin = true;
  emailC = null;
  passwordC = null;
  number = "07";
  error = '';
  isVerified = true;
  errorMsgLogin = false;
  errorboolean = false;
  languge: boolean;
  persianNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
  arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  appVerifier;
  msgConfirmationError = false;
  number2;
  code;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.languge = data;
  });
  constructor( private alertCtrl: AlertController, private firebasee:AngularFireAuth, private modalController: ModalController,  private menuService: MenuServiceService, public loadingController: LoadingController, private router:Router, private alertController: AlertController, private catagotiesService:CatagoriesService, private authService: AuthService) { }

  ngOnInit() {


    this.catagotiesService.fetchProducts().subscribe();
    let lang = null;
    if(!this.languge){
      lang = "en";
    }else {
      lang = "ar";
    }
    this.appVerifier = new firebase.auth.RecaptchaVerifier( "recaptcha-container", {'hl' : lang,
      "size": "invisible",
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //console.log("call");
       //this.signInWithNumber();
      }
    });
  }

  ionViewWillEnter(){
    this.isLogin = true;
  }


  fixNumbers (str:any)
{
  if(typeof str === 'string')
  {
    for(var i=0; i<10; i++)
    {
      str = str.replace(this.persianNumbers[i], i).replace(this.arabicNumbers[i], i);
    }
  }
  return str;
};

  menuClicked(){
    this.menuService.menuClicked();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }


  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
        //console.log('Loader closed!', response);
    }).catch((err) => {
        //console.log('Error occured : ', err);
    });
}




  sendConfirmationMsg(){
    setTimeout(function(){
      //console.log("Hello");
    }, 3000);

    if(this.languge){
      this.presentLoading();
    this.number2 = "+962"+ this.number.substring(1);
    //console.log(this.number);


    this.firebasee.signInWithPhoneNumber(this.number2,this.appVerifier).then(async (confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      //console.log("done");
      this.appVerifier.reset();

      this.dismissLoader()





  let prompt = await this.alertCtrl.create({
    header: "الرجاء ادخال رمز التحقق",
    inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
    buttons: [
      { text: 'الغاء',
        handler: data => {
          // console.log('Cancel clicked');
          }
      },
      { text: 'تحقق',
        handler: data => {
          data.confirmationCode = this.fixNumbers(data.confirmationCode);
          //console.log(data.confirmationCode,"confirmation code");
          confirmationResult.confirm(data.confirmationCode)
          .then( (result) => {
            // User signed in successfully.
            //console.log(result.user);
           // console.log("good");
            this.isVerified = true;
            //console.log(this.isVerified);
            this.msgConfirmationError = false;
            // ...
          }).catch( (error) => {
            //console.log("bad");
            this.msgConfirmationError = true;
            this.isVerified = false;
           // console.log(error,";;;;;");
            // ...
          });
        }
      }
    ]
  });
   await prompt.present();


}).catch((error) => {
 // console.log("error");
  // Error; SMS not sent
  // ...
});

    }else {
      this.presentLoading();
    this.number2 = "+962"+ this.number.substring(1);
    //console.log(this.number);


    this.firebasee.signInWithPhoneNumber(this.number2,this.appVerifier).then(async (confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      //console.log("done");
      this.appVerifier.reset();
      this.dismissLoader()






  let prompt = await this.alertCtrl.create({
    header: "Please enter your confirmation code",
    inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
    buttons: [
      { text: 'Cancel',
        handler: data => {
          //console.log('Cancel clicked');
         }
      },
      { text: 'Send',
        handler: data => {
          confirmationResult.confirm(data.confirmationCode)
          .then( (result) => {
            // User signed in successfully.
            //console.log(result.user);
            //console.log("good");
            this.isVerified = true;
            //console.log(this.isVerified);
            this.msgConfirmationError = false;
            // ...
          }).catch( (error) => {
            //console.log("bad");
            this.msgConfirmationError = true;
            this.isVerified = false;
           // console.log(error,";;;;;");
            // ...
          });
        }
      }
    ]
  });
   await prompt.present();


}).catch((error) => {
  //console.log("error");
  // Error; SMS not sent
  // ...
});
    }



}



  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    if(!this.isLogin && form.value.password !== form.value.passwordConfirmation){
      if(!this.languge){
        this.error = "Password does notmatch";
      }else{
        this.error = "خانة الباسورد و تاكيد الباسور غير متشابة";
      }
      this.errorboolean = true;
      return;
    }
    if(!this.isLogin && form.value.email!==form.value.emailConfirmation){
      if(!this.languge){
        this.error= "Email does not match";
      }else{
        this.error= "الايميل و خانة تاكيد الايميل غير متشابة";
      }
      this.errorboolean = true;
      return;
    }

    this.errorboolean = false;
    const email = form.value.email;
    const password = form.value.password;
    const name = form.value.name;
    //form.value.password.reset()
    //form.reset();
    //console.log(email,password, this.number2);
    if(this.isLogin){
      this.authService.login(email,password).subscribe(resdata => {
       // console.log(resdata);
        this.router.navigateByUrl('/');
      },
        err => {
          const code = err.error.error.message;
          let message = "could not sign you in, please try again later";
          if (code === "EMAIL_NOT_FOUND"){
            if(!this.languge){
              message = 'this email address is not found';
            }else{
              message = 'الرجاء التحقق من الايميل و الرقم السري';
            }
          }else if(code === "INVALID_PASSWORD"){
            if(!this.languge){
              message = "invalid password";
            }else{
              message = 'الرجاء التحقق من الايميل و الرقم السري';
            }
          }
          //this.showAlert(message);
          this.errorMsgLogin = true;
        } )

    }else{
      this.authService.signup(email,password).subscribe(resData => {
        this.authService.addUserToMyDatabase(resData.localId, name, this.number2, email).subscribe(resData=>{
          if(!this.languge){
            this.alertController.create({header: 'Sign up successfully', message: "signed up successfully, redirecting to home  page", buttons: ['Okey']}).then(alert=>alert.present());
            this.router.navigateByUrl("/");
          }else{
            this.alertController.create({header: 'إنشاء حساب', message: "تم إنشاء حساب جديد بنجاح.... يتم الآن تحويلك الى الصفحة الرئيسية", buttons: ['تم']}).then(alert=>alert.present());
            this.router.navigateByUrl("/");
          }
          //console.log('done');
        });

      }, err => {
        const code = err.error.error.message;
        if(!this.languge){
          let message = "could not sign you up, please try again later";
          if (code === "EMAIL_EXISTS"){
            message = 'this email address is already in use please try with another one';
          }
          this.showAlert(message);

        }else{
          let message = "فشل محا،ولة انشاء حساب جديد...الرجاء محاولة مرة اخرى";
          if (code === "EMAIL_EXISTS"){
            message = 'البريد الالكتروني مستخدم من قبل الرجاء استعمال بريد الكتروني اخر';
          }
          this.showAlert(message);
        }
      })
    }
  }

  async openModal() {
    const modal = await this.modalController.create({
    component: NumberConfirmationModalComponent
    });
    return await modal.present();
   }

  switchMode(){
    if(this.isLogin){
      //this.openModal();
      this.isVerified = false;
    }else{
      this.isVerified = true
    }
    this.isLogin = !this.isLogin
    //console.log(this.isVerified, this.isLogin);

  }

  onLogin(){
    //console.log();
  }

  showAlert(message:string){
    if(this.languge){
      this.alertController.create({header: 'فشل في انشاء حساب جديد', message: message, buttons: ['تم']}).then(alert=>alert.present());
    }else{
      this.alertController.create({header: 'Authentication failed', message: message, buttons: ['Okey']}).then(alert=>alert.present());
    }
  }

}
