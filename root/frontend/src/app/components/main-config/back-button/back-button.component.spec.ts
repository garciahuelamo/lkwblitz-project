import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { Location } from '@angular/common';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    await TestBed.configureTestingModule({
      imports: [BackButtonComponent],
      providers: [
        { provide: Location, useValue: locationSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe llamar location.back() al ejecutar goBack', () => {
    component.goBack();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
