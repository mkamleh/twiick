import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {
  private fooSubject = new Subject<any>();
  private langugueSubject = new BehaviorSubject<boolean>(false);


  isClicked = false;
  langugue = false;

  constructor(private router:Router) { }

  menuClicked(){
    this.isClicked = !this.isClicked;
    this.fooSubject.next(this.isClicked);
    //console.log("pressed");
  }

  getLangugue(){
    return this.langugueSubject.asObservable();
  }

  getClicked (){
    return this.fooSubject.asObservable();
  }

  changeLanguge(){
    this.langugue = !this.langugue;
    this.langugueSubject.next(this.langugue);
    this.router.navigateByUrl("/");
  }

  changeLangugeForUpdate(){
    this.langugue = !this.langugue;
    this.langugueSubject.next(this.langugue);
    this.router.navigateByUrl("/update");
  }
}
