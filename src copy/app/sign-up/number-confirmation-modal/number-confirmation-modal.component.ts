import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MenuServiceService } from 'src/app/menu-service.service';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-number-confirmation-modal',
  templateUrl: './number-confirmation-modal.component.html',
  styleUrls: ['./number-confirmation-modal.component.scss'],
})
export class NumberConfirmationModalComponent implements OnInit {

  appVerifier;
  code;
  form: FormGroup;
  firebasecalled = true;
  name = 12;

  constructor( private alertCtrl: AlertController,  private modalCtrl:ModalController, private firebasee:AngularFireAuth, private httpClinet: HttpClient, private menuService: MenuServiceService) { }

  ngOnInit() {

    // if(this.firebasecalled){
    // firebase.initializeApp(environment.firebaseConfig);
    // this.firebasecalled = false;
    // }
    this.appVerifier = new firebase.auth.RecaptchaVerifier( "recaptcha-container", {
      size: "invisible",
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        //console.log("call");
       //this.signInWithNumber();
      }
    });


    this.firebasee.signInWithPhoneNumber('+962799702071',this.appVerifier).then(async (confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      //console.log("done");


      let prompt = await this.alertCtrl.create({
        header: 'Enter',
        inputs: [{ name: 'confirmationCode', placeholder: 'Confirmation Code' }],
        buttons: [
          { text: 'Cancel',
            handler: data => {
             // console.log('Cancel clicked')
              ; }
          },
          { text: 'Send',
            handler: data => {
              confirmationResult.confirm(data.confirmationCode)
              .then(function (result) {
                // User signed in successfully.
                //console.log(result.user);
                // ...
              }).catch(function (error) {
                //console.log(error);
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

  sendmsg(){
    //console.log(this.name);
  }

  dismiss() {
    this.modalCtrl.dismiss();
    }

}
