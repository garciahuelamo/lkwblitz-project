import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserHeaderComponent } from './user-header.component';
import { AuthService } from '../../../services/service.service';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';

describe('UserHeaderComponent', () => {
  let component: UserHeaderComponent;
  let fixture: ComponentFixture<UserHeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userSubject: Subject<any>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser$: of({ name: 'Test', id: 1, email: 'test@mail.com', role: 'admin' })
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userSubject = new Subject();
    await TestBed.configureTestingModule({
      imports: [UserHeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el nombre de usuario desde el observable', () => {
    component.ngOnInit();
    expect(component.userName).toBe('Test');
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
    expect(component.userName).toBe('Guest');
    expect(component.userMenuOpen).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debe actualizar el reloj', () => {
    const before = component.currentTime;
    (component as any).updateClock();
    expect(component.currentTime).not.toBe(before);
  });

  it('debe limpiar el clockSubscription en ngOnDestroy', () => {
    const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component['clockSubscription'] = subSpy;
    component.ngOnDestroy();
    expect(subSpy.unsubscribe).toHaveBeenCalled();
  });
});
