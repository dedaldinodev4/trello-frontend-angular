import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocketService } from 'src/app/shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  errorMessage: string | null = null;
    form = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required],
    });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private socketService: SocketService
    ) {}

    onSubmit(): void {
        this.authService.login(this.form?.value)
            .subscribe({
                next: (currentUser) => {
                    console.log('currentUser', currentUser);
                    this.authService.setTokenFromStorage(currentUser)
                    this.authService.setCurrentUser(currentUser)
                    this.socketService.setupSocketConnection(currentUser)
                    this.errorMessage = null
                    this.router.navigateByUrl('/');
                },
                error: (err: HttpErrorResponse) => {
                    console.log('err', err.error)
                    this.errorMessage = err.error;
                }
            })  
        
        
    }

  ngOnInit(): void {
  }

}
