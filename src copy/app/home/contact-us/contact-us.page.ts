import { Component, OnInit } from '@angular/core';
import { MenuServiceService } from 'src/app/menu-service.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(private menuService: MenuServiceService) { }

  sub = this.menuService.getLangugue().subscribe(data =>{
    this.languge = data;
  });
  languge: boolean;


  ngOnInit() {
  }

  menuClicked(){
    this.menuService.menuClicked();
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    //send infor to database
    //alert
    //form reset


  }

}
