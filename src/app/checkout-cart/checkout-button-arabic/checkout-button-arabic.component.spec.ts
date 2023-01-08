import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckoutButtonArabicComponent } from './checkout-button-arabic.component';

describe('CheckoutButtonArabicComponent', () => {
  let component: CheckoutButtonArabicComponent;
  let fixture: ComponentFixture<CheckoutButtonArabicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutButtonArabicComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutButtonArabicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
