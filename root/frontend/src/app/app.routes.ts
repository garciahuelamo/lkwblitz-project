import { Routes } from '@angular/router';
import { LoginComponent } from './components/main-config/login/login.component';
import { ForgotPasswordComponent } from './components/main-config/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/main-config/reset-password/reset-password.component';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';
import { UserHomeComponent } from './components/user/user-home/user-home.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminSettingComponent } from './components/admin/admin-setting/admin-setting.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { CreateOrderComponent } from './components/user/create-order/create-order.component';
import { RatesComponent } from './components/user/rates/rates.component';
import { UserSettingsComponent } from './components/user/user-settings/user-settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },

  // HOME's
  { 
    path: 'admin/home', 
    component: AdminHomeComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'admin' },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'settings', component: AdminSettingComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'user/home',
    component: UserHomeComponent, // layout con header y cards
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' },
    children: [
      { path: 'settings', component: UserSettingsComponent }, // <-- agregada ruta de settings
      { path: '', redirectTo: '', pathMatch: 'full' }
    ]
  },
  {
    path: 'user/create-order', 
    component: CreateOrderComponent, // página independiente solo con el formulario
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' }
  },
  {
    path: 'user/rates', 
    component: RatesComponent,  // página de tarifas
    canActivate: [authGuard, roleGuard],
    data: { role: 'user' }
  },

  // DEFAULT
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
