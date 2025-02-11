import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import {AuthStoreService} from './auth-store.service';

export function authGuard(role: string | null = null): CanMatchFn {
  return () => {
    const authState = inject(AuthStoreService);
    const router = inject(Router);
    if (
      !authState.isAuthenticated() ||
      (role && authState.tokenDecoded()?.role !== role)
    ) {
      router.navigateByUrl('/sign-in');
      return false;
    }
    return true;
  };
}
