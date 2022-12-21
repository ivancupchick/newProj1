import { Injectable, OnDestroy } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import firebase from 'firebase/compat/app';

import { Observable, from, of, zip, BehaviorSubject } from 'rxjs';
import { take, tap, concatMap, catchError, map, mergeMap } from 'rxjs/operators';
import 'firebase/database';
// import { UserInfo, UserGroup, IUserInfo, IUserGroup } from './entities';
// import { UserInfosService } from '../server/user-infos.service';
// import { UserGroupsService } from '../server/user-groups.service';

enum UserRole {
  User = 'User',
  Admin = 'Admin'
}

export interface UserInfo {
  uid: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  user: Observable<firebase.User | null>;

  currentUID: string = '';

  linkUsers: AngularFireList<UserInfo>;
  userInfo: BehaviorSubject<UserInfo | null> = new BehaviorSubject<UserInfo | null>({ uid: '', role: UserRole.User});

  users: UserInfo[] = [];

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.linkUsers = db.list('users');
    this.user = afAuth.authState;

    this.user.subscribe( (user) => { // unsubscribe please
      if (user) {
        this.currentUID = user.uid;
        this.getUserInfo().subscribe();
      }
    });

    // this.userInfo = this.receiveUserInfo();
    // console.log(this.userInfo);
  }

  ngOnDestroy() {
    //
  }

  public getUserInfo(): Observable<UserInfo | null> {
    return zip(
        this.user.pipe( take(1) ),
        this.linkUsers.valueChanges().pipe( take(1) )
      ).pipe(
        map(([user, users]) => {
          this.users = users || [];
          const userInfo = user
            ? users.find(userObs => userObs.uid === user.uid)
            : null;

          if (!userInfo) {
            return null;
          }

          this.userInfo.next(userInfo);
          return userInfo;
        })
      );

    //     .subscribe(user => {
    //       this.usersService.getList()
    //         .pipe( take(1) )
    //         .subscribe((users: UserInfo[]) => {
    //           const userInfo = user ? users.find(userObs => userObs.uid === user.uid) : null;
    //           obs.next(userInfo || null);
    //         });
    //     });
    // });
  }

  private pushUserInfoToDB = (credential: firebase.auth.UserCredential | null): Observable<boolean> => {
    if (!credential) {
      return of(false);
    }

    return new Observable((obs) => {
        let count = true; // we can delete this
        this.users.forEach( (user: UserInfo) => { // we can delete this
          if (user.uid === credential.user?.uid || '') { // we can delete this
            count = false; // we can delete this
          } // we can delete this
        }); // we can delete this
        if (count) { // we can delete this
          const user: UserInfo = {
            uid: credential.user?.uid || '',
            role: UserRole.User
          };

          this.linkUsers
            .push(user)
            .then((response) => {
              console.log(response);
              obs.next(true);
            })
            .catch((err) => {
              console.log(err);
              obs.next(false);
            });
        }
    });


      //  this.usersService.createListItem(user)
      //   .pipe(
      //     tap((res => {
      //       if (res) {
      //         console.log('success');
      //       }
      //     }))
      //   );

      // this.linkUsers
      //   .push(user)
      //   .catch((error) => {
      //     console.log(error);
      //   })
      //   .finally(() => {
      //     console.log('end');
      //   });
    // }
  }

  // getUser(): any {
  //   return this.afAuth.authState;
  // }

  loginWithEmail = (options: { email: string, password: string }): Observable<any> => {
    return from(this.afAuth.signInWithEmailAndPassword(options.email, options.password));
  }

  loginWithGoogle(): Observable<boolean> {
    const self = this;
    return from(self.afAuth.signInWithPopup( new firebase.auth.GoogleAuthProvider() ))
      .pipe(
        catchError(err => {
          console.log(err);

          return of(null);
        }),
        mergeMap((credential) => {
          return this.pushUserInfoToDB(credential);
        })
      );
  }

  // loginWithFacebook(): any {
  //   from(this.afAuth.auth.signInWithPopup( new auth.FacebookAuthProvider() )).subscribe(
  //     (credential) => {
  //       this.pushUserInfoToDB(credential);
  //     }, (error) => {
  //       throw new Error(error);
  //     }
  //   );
  // }

  public createUserWithEmail = (options: { email: string, password: string }): Observable<boolean> => {
    return from(this.afAuth.createUserWithEmailAndPassword(options.email, options.password))
      .pipe(
        concatMap((credential) => {
          return this.pushUserInfoToDB(credential);
        }),
        catchError((error) => of(error))
      );
  }

  // public getCurrentUserInfo(): Observable<UserInfo> {
  //   return this.userInfo;
  // }

  // public getUserInfo(): Observable<UserInfo> {
  //   return this.getUsersValueChanges()
  //     .pipe(
  //       map((users: UserInfo[]) => {
  //         const user = users.find(userInfomation => userInfomation.uid === this.userId);

  //         return user;
  //       })
  //     );
  // }

  public getUserInfoFromDBWithUID(uid: string): UserInfo | undefined {
    return this.users.find(user => user.uid === uid);
  }

  public logOut(): void {
    this.currentUID = '';
    this.userInfo.next(null);
    this.afAuth.signOut();
  }

  // get currentUserObservable(): Observable<User> {
  //   return this.afAuth.authState;
  // }

  // getUsersValueChanges() {
  //   return this.linkUsers.valueChanges();
  // }
}
