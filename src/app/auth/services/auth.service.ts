import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map, filter } from "rxjs";
import { IUserCurrentDTO, 
    IUserLoginRequestDTO,
    IUserRegisterRequestDTO } from "../dtos/UserAuthDTO";
import { HttpClient } from '@angular/common/http'
import { environment } from "src/environments/environment";
import { SocketService } from "src/app/shared/services/socket.service";


@Injectable()
export class AuthService {
    currentUser$ = new BehaviorSubject<IUserCurrentDTO | null | undefined>(
        undefined
    );

    isLogged$ = this.currentUser$.pipe(
        filter((currentUser: any) => currentUser !== undefined),
        map(Boolean)
    )

    constructor(
        private http: HttpClient, 
        private socketService: SocketService
    ) {}

    getCurrentUser(): Observable<IUserCurrentDTO> {
        return this.http.get<IUserCurrentDTO>(`${environment.apiUrl}/user`);
    }

    register(registerRequest: IUserRegisterRequestDTO)
        : Observable<IUserCurrentDTO> {
        return this.http.post<IUserCurrentDTO>(`${environment.apiUrl}/auth/register`,registerRequest)
    }

    login(loginRequest: IUserLoginRequestDTO): Observable<IUserCurrentDTO> {
        return this.http.post<IUserCurrentDTO>(`${environment.apiUrl}/auth/login`, loginRequest)
    }

    setTokenFromStorage(currentUser: IUserCurrentDTO): void {
        localStorage.setItem('trello-token', currentUser.token)
    }

    setCurrentUser(currentUser: IUserCurrentDTO | null): void {
        this.currentUser$.next(currentUser)
    }

    logout(): void {
        localStorage.removeItem('trello-token');
        this.currentUser$.next(null);
        this.socketService.disconnect();
  }
}