import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSettingsComponent } from './user-settings.component';
import { AuthService, User } from '../../../services/service.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUser']);
    await TestBed.configureTestingModule({
      imports: [UserSettingsComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con el usuario actual', () => {
    const mockUser: User = { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' };
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();
    expect(component.userForm.value.name).toBe(mockUser.name);
    expect(component.userForm.value.email).toBe(mockUser.email);
    expect(component.userForm.get('role')?.value).toBe(mockUser.role);
  });

  it('debe llamar a updateUser y mostrar alerta al enviar el formulario', () => {
    const mockUser: User = { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' };
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.updateUser.and.returnValue(of(mockUser));
    spyOn(window, 'alert');
    component.ngOnInit();
    component.userForm.patchValue({ name: 'Nuevo', email: 'nuevo@mail.com' });
    component.onSubmit();
    expect(authServiceSpy.updateUser).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Nuevo', email: 'nuevo@mail.com', role: 'admin' }));
    expect(window.alert).toHaveBeenCalledWith('Datos actualizados correctamente');
  });
});
