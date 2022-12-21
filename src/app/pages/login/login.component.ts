import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  email: any;
  name: any;
  password: any;
  isLogging = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onSubmit(formData: NgForm) {
    const obs = this.isLogging
      ? this.authService.createUserWithEmail
      : this.authService.loginWithEmail;

    obs(formData.value).subscribe(
      success => {
        console.log(success);
        this.linkToHome();
      }, error => {
        console.log(error);
        alert(error);
        // this.error = error;
      }
    );
  }

  linkToHome() {
    this.router.navigateByUrl('');
  }

  loginGoogle() {
    this.authService.loginWithGoogle()
      .subscribe((res) => {
        if (res) {
          this.linkToHome();
        }
      });
  }
}
