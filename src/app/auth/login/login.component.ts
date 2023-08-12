import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit{

  @ViewChild('googleBtn') googleBtn!: ElementRef<any>;

  public formSubmitted = false;

  public loginForm = this.fb.group({

    email:     [ localStorage.getItem('email') || '', [ Validators.required]],
    password:  [ '', [ Validators.required]],
    remember:  [ false ]
    
  });


  constructor(private router: Router,
              private fb: FormBuilder, 
              private usuarioService: UsuarioService,
              private ngZone: NgZone
  ){}
              
  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    this.googleInit()  
  }
  
  googleInit() {
    google.accounts.id.initialize({
      client_id: "433242360053-6905sb57to2j1ak4aonnjqcctearjivh.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog  }
  
  }

  handleCredentialResponse(response: any) {
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
          .subscribe( (resp: any) => {
            // console.log({login: resp});
            this.ngZone.run(() => {
              this.router.navigateByUrl('/');
            });
          })
  }
  
  login(){
    // console.log(this.loginForm.value);
    this.usuarioService.login((this.loginForm.value as LoginForm))
          .subscribe((resp) => {
            // console.log(resp);
            if ( this.loginForm.get('remember')?.value){
              localStorage.setItem('email', (this.loginForm as any).get('email')?.value);
            }else {
              localStorage.removeItem('email');
            }
            //Move to dashboard
            this.router.navigateByUrl('/');
          }, (err: any) =>{
            // Si sucede un error
            Swal.fire('Error', err.error.msg, 'error')
            console.warn(err.error.msg);        
          });
  }


}
