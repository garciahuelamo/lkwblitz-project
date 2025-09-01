import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminSettingComponent } from './admin-setting.component';
import { AuthService, User } from '../../../services/service.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('AdminSettingComponent', () => {
  let component: AdminSettingComponent;
  let fixture: ComponentFixture<AdminSettingComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'updateUser']);
    await TestBed.configureTestingModule({
      imports: [AdminSettingComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSettingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar el formulario con el usuario actual', () => {
    const mockUser: User = { id: 1, name: 'Admin', email: 'admin@mail.com', role: 'admin' };
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();
    expect(component.userForm.value.name).toBe(mockUser.name);
    expect(component.userForm.value.email).toBe(mockUser.email);
  });

  it('debe llamar a updateUser y mostrar alerta al enviar el formulario', () => {
    const mockUser: User = { id: 1, name: 'Admin', email: 'admin@mail.com', role: 'admin' };
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);
    authServiceSpy.updateUser.and.returnValue(of(mockUser));
    spyOn(window, 'alert');
    component.ngOnInit();
    component.userForm.patchValue({ name: 'Nuevo', email: 'nuevo@mail.com' });
    component.onSubmit();
    expect(authServiceSpy.updateUser).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Nuevo', email: 'nuevo@mail.com' }));
    expect(window.alert).toHaveBeenCalledWith('Datos actualizados correctamente');
  });
});
