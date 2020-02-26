import { Injectable } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth} from '@angular/fire/auth';
import { User, auth } from 'firebase/app';

import { Observable, from, of, zip } from 'rxjs';
import { take, tap, concatMap, catchError, map, mergeMap } from 'rxjs/operators';
import 'firebase/database';
// import { UserInfo, UserGroup, IUserInfo, IUserGroup } from './entities';
// import { UserInfosService } from '../server/user-infos.service';
// import { UserGroupsService } from '../server/user-groups.service';

interface UserInfo {
  uid: string;
  role: 'User' | 'Admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  currentUID: string;

  linkUsers: AngularFireList<UserInfo>;
  userInfo: UserInfo;

  users: UserInfo[];

  constructor(private afAuth: AngularFireAuth, private  db: AngularFireDatabase) {
    // this.linkUsers = db.list('users');
    // this.user = afAuth.authState;

    // this.user.subscribe( (user) => {
    //   if (user) {
    //     this.currentUID = user.uid;
    //   }
    // });

    // this.userInfo = this.receiveUserInfo();
    // console.log(this.userInfo);
  }

  public getUserInfo(): Observable<UserInfo> {
    return zip(
        this.user.pipe( take(1) ),
        this.linkUsers.valueChanges().pipe( take(1) )
      ).pipe(
        map(([user, users]) => {
          this.users = users || [];
          const userInfo = user
            ? users.find(userObs => userObs.uid === user.uid)
            : null;
          return userInfo || null;
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

  private pushUserInfoToDB(credential: auth.UserCredential): Observable<boolean> {
    if (!credential) {
      return null;
    }

    return new Observable((obs) => {
        let count = true; // we can delete this
        this.users.forEach( (user: UserInfo) => { // we can delete this
          if (user.uid === credential.user.uid) { // we can delete this
            count = false; // we can delete this
          } // we can delete this
        }); // we can delete this
        if (count) { // we can delete this
          const user: UserInfo = {
            uid: credential.user.uid,
            role: 'User'
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

  loginWithEmail(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }

  loginWithGoogle(): Observable<boolean> {
    return from(this.afAuth.signInWithPopup( new auth.GoogleAuthProvider() ))
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

  public createUserWithEmail(options: { email: string, password: string }): Observable<boolean> {
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

  public getUserInfoFromDBWithUID(uid: string): UserInfo {
    let userResult: UserInfo;
    this.users.forEach(user => {
      if (user.uid === uid) {
        userResult = user;
      }
    });
    return userResult;
  }

  public logOut(): void {
    this.currentUID = '';
    this.userInfo = null;
    this.afAuth.signOut();
  }

  // get currentUserObservable(): Observable<User> {
  //   return this.afAuth.authState;
  // }

  // getUsersValueChanges() {
  //   return this.linkUsers.valueChanges();
  // }
}
