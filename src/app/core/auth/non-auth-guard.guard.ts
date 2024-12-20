import {CanMatchFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthStoreService} from './auth-store.service';

  export function nonAuthGuard(): CanMatchFn {
    return () => {
      const authState = inject(AuthStoreService);
      const router = inject(Router);
      if (authState.isAuthenticated()) {
        router.navigateByUrl('/dashboard');
        return false;
      }
      return true;
    };
  }
