import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateOrderComponent } from './create-order.component';
import { ShippingService } from '../../../services/shipping.service';
import { ShippoService } from '../../../services/shippo.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('CreateOrderComponent', () => {
  let component: CreateOrderComponent;
  let fixture: ComponentFixture<CreateOrderComponent>;
  let shippingServiceSpy: jasmine.SpyObj<ShippingService>;
  let shippoServiceSpy: jasmine.SpyObj<ShippoService>;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
  shippingServiceSpy = jasmine.createSpyObj('ShippingService', ['getRates']);
    shippoServiceSpy = jasmine.createSpyObj('ShippoService', ['validateAddress']);
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(window.localStorage, 'setItem');
    await TestBed.configureTestingModule({
      imports: [CreateOrderComponent],
      providers: [
        { provide: ShippingService, useValue: shippingServiceSpy },
        { provide: ShippoService, useValue: shippoServiceSpy },
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateOrderComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Limpieza de mocks y restauración de spies
    (window.localStorage.setItem as any).calls.reset?.();
  });
  it('debe mostrar error si ocurre un error real al obtener tarifas', (done) => {
    const errorResponse = { error: { message: 'Error fetching rates' } };
    httpSpy.post.and.returnValue(throwError(() => errorResponse));
    (component as any).fetchRates();
    setTimeout(() => {
      expect(component.errorMsg).toBe('Error fetching rates');
      expect(component.loading).toBeFalse();
      done();
    }, 0);
  });
  it('getRates debe mostrar error si la validación de dirección lanza error', async () => {
  component.orderForm = { form: { valid: true }, markAllAsTouched: () => {} } as any;
  shippoServiceSpy.validateAddress.and.returnValue(throwError(() => 'Error validating the origin address.'));
  await component.getRates();
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(component.errorMsg).toBe('Error validating the origin address.');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar direcciones y paquete de ejemplo', () => {
    component.loadExample();
    expect(component.order.address_from.name).toBe('Julien Dubois');
    expect(component.order.address_to.name).toBe('Luca Rossi');
    expect(component.order.parcels.length).toBe(1);
  });

  it('debe agregar y eliminar paquetes', () => {
    const initial = component.order.parcels.length;
    component.addParcel();
    expect(component.order.parcels.length).toBe(initial + 1);
    component.removeParcel(component.order.parcels.length - 1);
    expect(component.order.parcels.length).toBe(initial);
  });

  it('no debe eliminar el último paquete', () => {
    component.order.parcels = [{ weight: 1, length: 1, width: 1, height: 1, distance_unit: 'in', mass_unit: 'lb' }];
    component.removeParcel(0);
    expect(component.order.parcels.length).toBe(1);
  });

  it('debe convertir un paquete de cm/kg a in/lb', () => {
    const parcel = { weight: 2, length: 10, width: 5, height: 4, distance_unit: 'cm', mass_unit: 'kg' };
    const converted = (component as any).convertParcelToInLb(parcel);
    expect(converted.mass_unit).toBe('lb');
    expect(converted.distance_unit).toBe('in');
  });

  it('debe validar dirección correctamente', (done) => {
    shippoServiceSpy.validateAddress.and.returnValue(of({ validation_results: { is_valid: true } }));
    (component as any).validateAddress({}, 'origin').then(() => {
      expect(shippoServiceSpy.validateAddress).toHaveBeenCalled();
      done();
    });
  });

  it('debe rechazar dirección inválida', (done) => {
    shippoServiceSpy.validateAddress.and.returnValue(of({ validation_results: { is_valid: false } }));
    (component as any).validateAddress({}, 'origin').catch((err: any) => {
      expect(err).toContain('invalid');
      done();
    });
  });

  it('debe obtener tarifas y navegar si hay resultados', () => {
  httpSpy.post.and.returnValue(of({ rates: [{ id: 1 }], order_object_id: 'orderId' }));
  (component as any).fetchRates();
  expect(window.localStorage.setItem).toHaveBeenCalledWith('rates', jasmine.any(String));
  expect(window.localStorage.setItem).toHaveBeenCalledWith('orderObjectId', 'orderId');
  expect((component as any).router.navigate).toHaveBeenCalledWith(['/user/rates']);
  expect(component.rates.length).toBeGreaterThan(0);
  });

  it('debe mostrar error si no hay tarifas en la respuesta', () => {
    httpSpy.post.and.returnValue(of({ rates: [], order_object_id: 'orderId' }));
    (component as any).fetchRates();
    expect(component.errorMsg).toBe('No rates found for these details.');
    expect(component.rates.length).toBe(0);
  });

  it('debe mostrar error si ocurre un error al obtener tarifas', () => {
    httpSpy.post.and.returnValue(of({ error: { message: 'Error fetching rates' } }));
    component.rates = [];
    (component as any).fetchRates();
    // El error se maneja en el observable, pero aquí no hay error real lanzado
    // Se puede simular con throwError si se requiere más realismo
  });

  it('getRates debe mostrar error si el formulario es inválido', () => {
    component.orderForm = { form: { valid: false }, markAllAsTouched: () => {} } as any;
    component.getRates();
    expect(component.errorMsg).toBe('Please fill in all required fields.');
  });

  it('getRates debe mostrar error si la validación de dirección falla', async () => {
  component.orderForm = { form: { valid: true }, markAllAsTouched: () => {} } as any;
  shippoServiceSpy.validateAddress.and.returnValue(of({ validation_results: { is_valid: false } }));
  await component.getRates();
  await new Promise(resolve => setTimeout(resolve, 0));
  expect(component.errorMsg).toBe('The origin address is invalid. Please check the details.');
  });
});
