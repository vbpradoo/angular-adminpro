import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {

  // console.log('paso por el canActivate del guard');
  const router = inject(Router)
  return inject(UsuarioService).validarToken()
            .pipe(
              tap( (isAuth) => {
                if(!isAuth){
                  router.navigateByUrl('/login');
                }
              })
            );
};
