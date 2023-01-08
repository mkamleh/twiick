import { Component, OnInit } from '@angular/core';
import { MenuServiceService } from '../menu-service.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  isClicked = false;
  languge = true;
  userState: boolean;


  constructor(private menuService: MenuServiceService,     private authService: AuthService,
    ) { }

  ngOnInit() {

    this.menuService.getClicked().subscribe(

      data => {
        this.isClicked = data;
        //console.log(data);
      }
    );

    this.menuService.getLangugue().subscribe(data => {
      this.languge = data;
    });

    this.authService.userIsAuthenticated.subscribe( isAuth => {
      this.userState =  isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  userIsloginin(){
    let data: boolean;
    //console.log(this.authService.userIsAuthenticated,"usercheckenin logout")

  }

  menuClicked(){
    this.menuService.menuClicked();
  }

  changeLanguge(){
    this.menuService.changeLanguge();
  }

}
