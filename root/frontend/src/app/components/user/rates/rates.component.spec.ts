import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatesComponent } from './rates.component';
import { ShippingService } from '../../../services/shipping.service';
import { AuthService } from '../../../services/service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RatesComponent', () => {
  let component: RatesComponent;
  let fixture: ComponentFixture<RatesComponent>;
  let shippingServiceSpy: jasmine.SpyObj<ShippingService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    shippingServiceSpy = jasmine.createSpyObj('ShippingService', ['buyLabel']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'rates') return JSON.stringify([{ id: 1, price: 10 }]);
      if (key === 'orderObjectId') return 'order123';
      return null;
    });
    await TestBed.configureTestingModule({
      imports: [RatesComponent],
      providers: [
        { provide: ShippingService, useValue: shippingServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar tarifas y orderObjectId desde localStorage en ngOnInit', () => {
    component.ngOnInit();
    expect(component.rates.length).toBeGreaterThan(0);
    expect(component.orderObjectId).toBe('order123');
  });

  it('debe mostrar error si no hay tarifas en localStorage', () => {
    (window.localStorage.getItem as jasmine.Spy).and.callFake((key: string) => null);
    component.ngOnInit();
    expect(component.errorMsg).toBe('No hay tarifas disponibles.');
  });

  it('debe comprar etiqueta y mostrar alerta', () => {
    shippingServiceSpy.buyLabel.and.returnValue(of({ label_url: 'url', tracking_number: '123' }));
    spyOn(window, 'alert');
    component.orderObjectId = 'order123';
    component.buyLabel('rate123');
    expect(shippingServiceSpy.buyLabel).toHaveBeenCalledWith('order123', 'rate123');
    expect(window.alert).toHaveBeenCalledWith('Etiqueta comprada correctamente!');
    expect(component.labelResult).toEqual({ label_url: 'url', tracking_number: '123' });
    expect(component.loading).toBeFalse();
  });

  it('debe mostrar error si no hay orderObjectId al comprar etiqueta', () => {
    component.orderObjectId = '';
    component.buyLabel('rate123');
    expect(component.errorMsg).toBe('No se encontró Order Object ID');
  });

  it('debe alternar el menú de usuario', () => {
    expect(component.userMenuOpen).toBeFalse();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeTrue();
    component.toggleUserMenu();
    expect(component.userMenuOpen).toBeFalse();
  });

  it('debe llamar logout y navegar a /login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe retornar la ruta del logo del carrier', () => {
    const logo = component.getCarrierLogo('Colissimo');
    expect(logo).toBe('assets/colissimo.png');
    const defaultLogo = component.getCarrierLogo('');
    expect(defaultLogo).toBe('assets/default.png');
  });
});
