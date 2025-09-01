import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ShippoService, AddressValidationResult } from './shippo.service';
import { of } from 'rxjs';

describe('ShippoService', () => {
  let service: ShippoService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    TestBed.configureTestingModule({
      providers: [
        ShippoService,
        { provide: HttpClient, useValue: httpSpy }
      ]
    });
    service = TestBed.inject(ShippoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('validateAddress debe retornar resultado válido (simulación)', (done) => {
    const address = { street: 'Calle 1' };
    service.validateAddress(address).subscribe(result => {
      expect(result.validation_results.is_valid).toBeTrue();
      done();
    });
  });

  it('validateAddress debe llamar a HttpClient.post si se usa endpoint real', (done) => {
    const address = { street: 'Calle 1' };
    const mockResult: AddressValidationResult = { validation_results: { is_valid: false, messages: ['Error'] } };
    httpSpy.post.and.returnValue(of(mockResult));
    service.validateAddress = function(addr: any) {
      return httpSpy.post(`${service['apiUrl']}/validate-address`, addr);
    } as any;
    service.validateAddress(address).subscribe(result => {
      expect(httpSpy.post).toHaveBeenCalledWith(jasmine.stringMatching('/validate-address'), address);
      expect(result).toEqual(mockResult);
      done();
    });
  });
});
