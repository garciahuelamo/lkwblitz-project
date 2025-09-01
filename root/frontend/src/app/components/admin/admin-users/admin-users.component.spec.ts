import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersComponent } from './admin-users.component';
import { UserService } from '../../../services/user.service';
import { of } from 'rxjs';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser', 'updateUser']);
    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar usuarios correctamente', () => {
    const mockUsers = [
      { id: 1, name: 'Test', email: 'test@mail.com', role: 'user' },
      { id: 2, name: 'Admin', email: 'admin@mail.com', role: 'admin' }
    ];
    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    component.loadUsers();
    expect(component.users.length).toBe(2);
    expect(component.filteredUsers.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('debe filtrar usuarios por nombre o email', () => {
    component.users = [
      { id: 1, name: 'Test', email: 'test@mail.com', role: 'user' },
      { id: 2, name: 'Admin', email: 'admin@mail.com', role: 'admin' }
    ];
    component.searchTerm = 'admin';
    component.filterUsers();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Admin');
  });

  it('debe iniciar edición de usuario', () => {
    const user = { id: 1, name: 'Test', email: 'test@mail.com', role: 'user' };
    component.startEditing(user);
    expect(component.editingUserId).toBe(1);
    expect(component.editedUser).toEqual(user);
  });

  it('debe cancelar edición de usuario', () => {
    component.editingUserId = 1;
    component.editedUser = { id: 1 };
    component.cancelEditing();
    expect(component.editingUserId).toBeNull();
    expect(component.editedUser).toBeNull();
  });

  it('debe actualizar usuario correctamente', () => {
    spyOn(window, 'confirm').and.returnValue(true);
  userServiceSpy.updateUser.and.returnValue(of({ id: 1, name: 'Test', email: 'test@mail.com', role: 'user' }));
    const user = { id: 1, name: 'Test', email: 'test@mail.com', role: 'user' };
    spyOn(component, 'loadUsers');
    component.updateUser(user);
    expect(userServiceSpy.updateUser).toHaveBeenCalledWith(user);
    expect(component.loadUsers).toHaveBeenCalled();
    expect(component.updatingUserId).toBeNull();
  });

  it('debe eliminar usuario correctamente', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userServiceSpy.deleteUser.and.returnValue(of(void 0));
    spyOn(component, 'loadUsers');
    component.deleteUser(1);
    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(component.loadUsers).toHaveBeenCalled();
    expect(component.deletingUserId).toBeNull();
  });
});
