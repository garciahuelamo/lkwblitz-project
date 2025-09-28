/*import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSettingsComponent } from './user-settings.component';
import { AuthService, User } from '../../../services/service.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUser: User = { id: 1, name: 'Test', email: 'test@mail.com', role: 'admin' };

  beforeEach(async () => {
  authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser', 'updateUser']);
  authServiceSpy.getCurrentUser.and.returnValue(mockUser);
  authServiceSpy.updateUser.and.returnValue(of({ message: 'OK', user: mockUser }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        FormBuilder
      ],
      declarations: [UserSettingsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', () => {
    expect(component.userForm.value.name).toBe(mockUser.name);
    expect(component.userForm.value.email).toBe(mockUser.email);
    expect(component.userForm.get('role')?.value).toBe(mockUser.role);
  });

  it('should call updateUser and show success alert on submit', () => {
    spyOn(window, 'alert');
    component.userForm.patchValue({ name: 'New', email: 'new@mail.com' });
    component.onSubmit();
    expect(authServiceSpy.updateUser).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'New',
      email: 'new@mail.com',
      role: 'admin'
    }));
    expect(window.alert).toHaveBeenCalledWith('Datos actualizados correctamente');
  });

  it('should show error alert if updateUser fails', () => {
    spyOn(window, 'alert');
    authServiceSpy.updateUser.and.returnValue(throwError(() => 'error'));
    component.userForm.patchValue({ name: 'New', email: 'new@mail.com' });
    component.onSubmit();
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar usuario');
  });
});*/