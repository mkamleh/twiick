import { Component, OnInit, AfterViewInit, ViewChild, Input, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Capacitor, Plugins } from '@capacitor/core';
import { Coordinatess } from '../../location.model';
import { MenuServiceService } from 'src/app/menu-service.service';
import { last } from 'rxjs/operators';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private menuService: MenuServiceService, private modalCtrl:ModalController,private renderer: Renderer2, private alertCtrl:AlertController) { }

  googleMaps: any;
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  @Input() center = {lat: 31.960790114862544, lng: 35.88106850487131};
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickListener: any;
  infoWindow: any;
  languge: boolean;
  sub = this.menuService.getLangugue().subscribe(data =>{
    this.languge = data;
  });



  ngOnInit() {

  }

  onCancel(){
    this.modalCtrl.dismiss();
  }


  private showErrorAlert() {
    if(!this.languge){
      this.alertCtrl
      .create({
        header: 'Could not fetch location',
        message: 'Please use the map to pick a location!',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
    }else{
      this.alertCtrl
      .create({
        header: 'خطأ في تحديد الموقع',
        message: 'الرجاء استعمال الخريطة او التأكد من الشبكة!',
        buttons: ['تم']
      })
      .then(alertEl => alertEl.present());
    }

  }


  ngAfterViewInit() {
    this.getGoogleMaps()
      .then(googleMaps => {
        this.infoWindow = new googleMaps.InfoWindow();
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });

        if(this.center.lat !==31.960790114862544){
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location'
          });
          marker.setMap(map);
        }

        // Define the LatLng coordinates for the polygon's path.
                const triangleCoords = [
            { lat: 31.989150649732125, lng: 35.80650329589844 },
            { lat: 31.949887194679903, lng: 35.815187711171546 },
            { lat: 31.93494206582934, lng: 35.88619784933588 },
            { lat: 35.886197849335884, lng: 35.88619784933588 },
          ];

          // const bermudaTriangle = new googleMaps.Map.polygon({
          //   paths: triangleCoords,
          //   strokeColor: "#FF0000",
          //   strokeOpacity: 0.8,
          //   strokeWeight: 2,
          //   fillColor: "#FF0000",
          //   fillOpacity: 0.35,
          // });
          // bermudaTriangle.setMap(map);




        const locationButton = document.createElement("button");
        if(!this.languge){
          locationButton.textContent = "Pan to Current Location";
        }else{
          locationButton.textContent = "تحديد الموقع";
        }
        locationButton.classList.add("custom-map-control-button");

        map.controls[googleMaps.ControlPosition.TOP_CENTER].push(locationButton);

        locationButton.addEventListener("click", () => {


          if (!Capacitor.isPluginAvailable('Geolocation')) {
            this.showErrorAlert();
            return;
          }
          Plugins.Geolocation.getCurrentPosition({enableHighAccuracy: true, timeout: 80000, maximumAge: 0})
            .then(geoPosition => {
              //console.log(geoPosition.coords.accuracy);
              const coordinates: Coordinatess = {
                lat: geoPosition.coords.latitude,
                lng: geoPosition.coords.longitude
              };
              this.infoWindow.setPosition(coordinates);
              if(!this.languge){
                this.infoWindow.setContent("Location found.");
              }else{
                this.infoWindow.setContent("تم تحديد العنوان.");
              }
                this.infoWindow.open(map);
                map.setCenter(coordinates);
            })
            .catch(err => {
              this.showErrorAlert();
            });





          // Try HTML5 geolocation.
          // if (navigator.geolocation) {
          //   navigator.geolocation.getCurrentPosition(
          //     (position: Position) => {
          //       const pos = {
          //         lat: position.coords.latitude,
          //         lng: position.coords.longitude,
          //       };

          //       this.infoWindow.setPosition(pos);
          //       this.infoWindow.setContent("Location found.");
          //       this.infoWindow.open(map);
          //       map.setCenter(pos);
          //     },
          //     () => {
          //       // handleLocationError(true, infoWindow, map.getCenter()!);
          //     }
          //   );
          // } else {
          //   // Browser doesn't support Geolocation
          //   console.log("error");
          // }
        });



        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });

        if (this.selectable) {
          this.clickListener = map.addListener('click', event => {
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            };
            this.modalCtrl.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location'
          });
          marker.setMap(map);
        }
      })
      .catch(err => {
        //console.log(err);
      });
  }

  //  handleLocationError(
  //   browserHasGeolocation: boolean,
  //   infoWindow: this.googleMaps.InfoWindow,
  //   pos: google.maps.LatLng
  // ) {
  //   infoWindow.setPosition(pos);
  //   infoWindow.setContent(
  //     browserHasGeolocation
  //       ? "Error: The Geolocation service failed."
  //       : "Error: Your browser doesn't support geolocation."
  //   );
  //   infoWindow.open(map);
  // }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

}
