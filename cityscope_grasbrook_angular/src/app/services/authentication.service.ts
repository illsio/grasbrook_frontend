import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of} from "rxjs";
import {map} from "rxjs/operators";
import {catchError, tap} from 'rxjs/internal/operators';
import {User} from "../models/user";
import {MatSnackBar} from "@angular/material";
import {AlertService} from "./alert.service";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public auth_url = `https://cityio.media.mit.edu/users/authenticate`;

    constructor(private http: HttpClient,
                private alertService: AlertService) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem("currentUser"))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username, password) {
        // possible base64
        // username = btoa(username);
        // password = btoa(password);

        // possible json for body
        // const user = {
        //     'username': username,
        //     'password': password
        // };

        let headers = new HttpHeaders();
        headers = headers.set('username', username);
        headers = headers.set('password', password);

        return this.http
            .post<any>(this.auth_url, {}, {headers: headers})
            .pipe(
                map(user => {
                    console.log(user);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.alertService.success("Designer Login successful", "");
                    return user;
                })
            );
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem("currentUser");
        this.currentUserSubject.next(null);
        this.alertService.success("Logout successful", "");
    }
}
