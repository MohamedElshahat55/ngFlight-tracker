import {computed, inject, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {injectLocalStorage} from 'ngxtension/inject-local-storage';
import { jwtDecode } from 'jwt-decode';
import {TokenDecoded} from './token-decoded';
import {explicitEffect} from 'ngxtension/explicit-effect';
import {createEffect} from 'ngxtension/create-effect';
import {AuthPayload} from './authpayload';
import {catchError, concatMap, map, pipe, throwError} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private auth = inject(AuthService)
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  /**
   * Creates a reactive signal for the 'token' key in Local Storage with cross-tab
   *  synchronization enabled.
   */

  token = injectLocalStorage<string|null>('token',{
    storageSync:true
  });

  isAuthenticated = computed(() => !!this.token);

  tokenDecoded = computed(() => {
    const token = this.token();
    if (!token) {
      return null;
    }
    return this.decodeToken(token);
  });

  constructor() {
    /**
     explicitEffect => watch the token signal only
     */
    explicitEffect(
      [this.token],
      ([token]) => {
        this.token.set(token ?? null);
        if (token) {
          this.router.navigateByUrl('/dashboard');
        } else {
          this.router.navigateByUrl('/sign-in');
        }
      },
      {
        defer: true,
      },
    );
  }
  // for init the app
  init() {
    console.log('Init auth');
  }

  /**
   * Decodes the JWT token.
   * @param {string} token - The JWT token to decode.
   * @returns {TokenDecoded | null} The decoded token object or null if decoding fails.
   */
  public decodeToken(token: string): TokenDecoded | null {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Logs in the user with the provided credentials.
   * @param {AuthPayload} payload - The authentication payload containing username and password.
   * @returns {Observable<any>} An observable that completes when the login process is finished.
   */
  login = createEffect<AuthPayload>(
    pipe(
      concatMap((payload) =>
        this.auth.login(payload).pipe(
          map((response) => {
            this.token.set(response.token);
            this.router.navigateByUrl('/dashboard');
            return response;
          }),
          catchError((err) => {
            if (err.status === 401) {
              this.snackBar.open('Wrong credentials', 'Dismiss', {
                duration: 5000,
              });
            } else {
              this.snackBar.open('An error occurred', 'Dismiss', {
                duration: 5000,
              });
            }
            return throwError(() => err);
          }),
        ),
      ),
    ),
  );


  /**
   * Logs out the user by clearing the token and navigating to the sign-in page.
   */
  logout() {
    this.token.set(null);
    this.router.navigateByUrl('/sign-in');
  }


}
