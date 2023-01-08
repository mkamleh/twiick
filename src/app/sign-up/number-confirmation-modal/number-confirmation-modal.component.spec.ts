import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NumberConfirmationModalComponent } from './number-confirmation-modal.component';
import { SharedModule } from 'src/app/sharedModule';

describe('NumberConfirmationModalComponent', () => {
  let component: NumberConfirmationModalComponent;
  let fixture: ComponentFixture<NumberConfirmationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberConfirmationModalComponent ],
      imports: [IonicModule.forRoot(), SharedModule]
    }).compileComponents();

    fixture = TestBed.createComponent(NumberConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
