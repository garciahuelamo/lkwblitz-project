import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ShippingService, RateRequest } from './shipping.service';
import { of } from 'rxjs';

describe('ShippingService', () => {
  let service: ShippingService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({
      providers: [
        ShippingService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });
    service = TestBed.inject(ShippingService);
    spyOn(window.localStorage, 'getItem').and.returnValue('fake-token');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getRates debe retornar tarifas', (done) => {
    const orderData: RateRequest = { address_from: {}, address_to: {}, parcels: [] };
    const mockRates = [{ id: 1, price: 10 }];
    httpSpy.post.and.returnValue(of(mockRates));
    service.getRates(orderData).subscribe(rates => {
      expect(rates).toEqual(mockRates);
      expect(httpSpy.post).toHaveBeenCalledWith(jasmine.stringMatching('/rates'), orderData, jasmine.any(Object));
      done();
    });
  });

  it('buyLabel debe llamar a HttpClient.post y retornar la respuesta', (done) => {
    const mockResponse = { label_url: 'url', tracking_number: '123' };
    httpSpy.post.and.returnValue(of(mockResponse));
    service.buyLabel('orderId', 'rateId').subscribe(result => {
      expect(httpSpy.post).toHaveBeenCalledWith(jasmine.stringMatching('/buy-label'), { orderObjectId: 'orderId', rateObjectId: 'rateId' }, jasmine.any(Object));
      expect(result).toEqual(mockResponse);
      done();
    });
  });

  it('getAuthHeaders lanza error si no hay token', () => {
    (window.localStorage.getItem as jasmine.Spy).and.returnValue(null);
    expect(() => service['getAuthHeaders']()).toThrowError('No se encontró token de autenticación');
  });
});
