import { Injectable } from "@angular/core";
import { io, Socket } from 'socket.io-client'
import { IUserCurrentDTO } from "src/app/auth/dtos/UserAuthDTO";
import { environment } from "src/environments/environment";

@Injectable()
export class SocketService {
    socket: Socket | undefined;


    setupSocketConnection(currentUser: IUserCurrentDTO): void {
        this.socket = io(environment.sockectUrl, {
            auth: {
                token: currentUser.token,
            }
        })
    }

    disconnect(): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established')
        }
        this.socket.disconnect()
    }

    emit(eventName: string, message: any): void {
        if (!this.socket) {
            throw new Error('Socket connection is not established')
        }
        this.socket.emit(eventName, message);
    }
}