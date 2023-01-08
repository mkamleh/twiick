import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PlaceLocation, Coordinatess } from '../../location.model';
import { Capacitor, Plugins } from '@capacitor/core';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { MenuServiceService } from 'src/app/menu-service.service';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() selectedLocationImage: string;
  @Input() openMenu : boolean = true;
  isLoading = false;
  languge: boolean;
  locationAvailable = false;

  sub = this.menuService.getLangugue().subscribe(data =>{
    this.languge = data;
  });

  constructor(private menuService: MenuServiceService, private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController, private alertCtrl: AlertController,     private http: HttpClient,


    ) { }

  ngOnInit() {}

  onPickLocation() {

    if(this.openMenu){
      if(!this.languge){

        this.actionSheetCtrl
        .create({
          header: 'Please Choose',
          buttons: [
            {
              text: 'Auto-Locate',
              handler: () => {
                this.locateUser();
              }
            },
            {
              text: 'Pick on Map',
              handler: () => {
                this.openMap();
              }
            },
            { text: 'Cancel', role: 'cancel' }
          ]
        })
        .then(actionSheetEl => {
          actionSheetEl.present();
        });

      }else{

        this.actionSheetCtrl
        .create({
          header: 'الرجاء الاختيار',
          cssClass: 'my-custom-class',
          buttons: [
            {
              text: 'تحديد تلقائي',
              handler: () => {
                this.locateUser();
              }
            },
            {
              text: 'الاختيار على الخريطة',
              handler: () => {
                this.openMap();
              }
            },
            { text: 'الغاء', role: 'الغاء' }
          ]
        })
        .then(actionSheetEl => {
          actionSheetEl.present();
        });

      }

    }

    }


  // onPickLocation(){
  //   this.modalCtrl.create({component:MapModalComponent}).then(modelEl => {
  //     modelEl.onDidDismiss().then(modalData => {
  //       if (!modalData.data) {
  //         console.log(null);
  //       }
  //       const coordinates: Coordinatess = {
  //         lat: modalData.data.lat,
  //         lng: modalData.data.lng
  //       };
  //       this.createPlace(coordinates.lat, coordinates.lng);
  //   });
  //   modelEl.present();
  // });

  // }



      private locateUser() {
        if (!Capacitor.isPluginAvailable('Geolocation')) {
          this.showErrorAlert();
          return;
        }
        this.isLoading = true;
        Plugins.Geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 800000, maximumAge: 0})
          .then(geoPosition => {
            //console.log(geoPosition.coords.accuracy);
            const coordinates: Coordinatess = {
              lat: geoPosition.coords.latitude,
              lng: geoPosition.coords.longitude
            };
            //console.log(coordinates.lat, coordinates.lng);
            if (coordinates.lat > 31.805872 && coordinates.lat < 32.004211  && coordinates.lng > 35.728305 && coordinates.lng < 35.997796 ) {
              //console.log("included");
              this.createPlace(coordinates.lat, coordinates.lng);
            }else{
              //console.log("out of location");
              this.showAlert();

            }
            this.isLoading = false;
          })
          .catch(err => {
            this.isLoading = false;
            this.showErrorAlert();
          });
      }

      private showErrorAlert() {
        this.alertCtrl
          .create({
            header: 'Could not fetch location',
            message: 'Please use the map to pick a location!',
            buttons: ['Okay']
          })
          .then(alertEl => alertEl.present());
      }

      showAlert(){
        if(this.languge){
          this.alertCtrl.create({header: 'فشل في اختيار الموقع', message:"عنوان التوصيل خارج نطاق التوصيل. مناطق التوصيل حاليا هي  خلدا الرابية الجاردنز الصويفية الدوار الرابع لدوار السابع الشميساني عبدون ام اذينة ", buttons: ['تم']}).then(alert=>alert.present());
        }else{
          this.alertCtrl.create({header: 'Location Error', message: "Location selected is out of our delivery zone. We  currently only deliver to Khalda, Rabieh, Gardens, Swaifyeh, Abdoun, Um Uthaniah, Shemishani, Fourth Circle to Seventh Circle", buttons: ['Okey']}).then(alert=>alert.present());
        }
      }

      private openMap() {
        this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
          modalEl.onDidDismiss().then(modalData => {
            if (!modalData.data) {
              return;
            }
            const coordinates: Coordinatess = {

              lat: modalData.data.lat,
              lng: modalData.data.lng
            };
            //console.log(coordinates);
            if (coordinates.lat > 31.945872 && coordinates.lat < 32.004211  && coordinates.lng > 35.828305 && coordinates.lng < 35.897796 ) {
              //console.log("included");
              this.createPlace(coordinates.lat, coordinates.lng);
            }else{
              //console.log("out of location");
              this.showAlert();
            }
          });
          modalEl.present();
        });
      }

      private createPlace(lat: number, lng: number) {
        this.locationAvailable = true;
        const pickedLocation: PlaceLocation = {
          lat: lat,
          lng: lng,
          address: null,
          staticMapImageUrl: null
        };
        this.isLoading = true;
        this.getAddress(lat, lng)
          .pipe(
            switchMap(address => {
              pickedLocation.address = address;
              return of(
                this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
              );
            })
          )
          .subscribe(staticMapImageUrl => {
            pickedLocation.staticMapImageUrl = staticMapImageUrl;
            this.selectedLocationImage = staticMapImageUrl;
            this.isLoading = false;
            this.locationPick.emit(pickedLocation);
          });
      }

      private getAddress(lat: number, lng: number) {
        return this.http
          .get<any>(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
              environment.googleMapsAPIKey
            }`
          )
          .pipe(
            map(geoData => {
              if (!geoData || !geoData.results || geoData.results.length === 0) {
                return null;
              }
              return geoData.results[0].formatted_address;
            })
          );
      }

      private getMapImage(lat: number, lng: number, zoom: number) {
        return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
        &markers=color:red%7Clabel:Place%7C${lat},${lng}
        &key=${environment.googleMapsAPIKey}`;
      }
    }




