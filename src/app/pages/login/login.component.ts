import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
  providers: [
    AuthService
  ]
})
export class LoginComponent implements OnInit {
  email: any;
  name: any;
  password: any;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    console.log(1);
  }

  onSubmit(formData) {
    // this.authService.loginWithEmail(formData.value.email, formData.value.password)
    //   .subscribe(success => {
    //     console.log(success);
    //     this.linkToHome();
    //   }, error => {
    //     console.log(error);
    //     // this.error = error;
    //   });

    // this.authService.createUserWithEmail(formData.value)
    //   .subscribe(res => {
    //     console.log(res);
    //     if (res) {
    //       this.linkToHome();
    //     } else {
    //       alert('Что-то пошло не так...');
    //     }
    //   }, error => {
    //     console.log(error);
    //   });
  }

  linkToHome() {
    console.log(1);
    this.router.navigateByUrl('');
  }

  loginGoogle() {
    // this.authService.loginWithGoogle()
    //   .subscribe((res) => {
    //     if (res) {
    //       this.linkToHome();
    //     }
    //   });
  }
}
