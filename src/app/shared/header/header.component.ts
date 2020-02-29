import { Component, OnInit, ViewChild, Renderer2, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService, UserInfo } from 'src/app/services/auth.service';
import { User } from 'firebase';

interface CustomRoute {
  name: string;
  active: boolean;
  route: string;
  items?: CustomRoute[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user: Observable<User>;
  userInfo: BehaviorSubject<UserInfo>;

  routes: CustomRoute[] = [{
    name: 'Главная', active: false, route: ''
  }, {
      name: 'Новые автомобили',
      active: false,
      route: 'new-cars',
      items: [
        { name: 'Кроссоверы', active: false, route: 'crossover' },
        { name: 'Универсамы', active: false, route: 'universal' },
        { name: 'Седаны', active: false, route: 'sedan' },
        { name: 'Минивэны', active: false, route: 'minivan' },
        { name: 'Хэтчбэки', active: false, route: 'hatchback' }
      ]
    }, {
      name: 'Финансирование',
      active: false,
      route: 'funding',
      items: [
        { name: 'Условия', active: false, route: 'conditions' },
        { name: 'Расчет', active: false, route: 'calculations' }
      ]
    }, {
      name: 'Трейд-ин', active: false, route: 'trade-in'
    }, {
      name: 'Гарантия', active: false, route: 'guarantee'
    }, {
      name: 'Контакты', active: false, route: 'contacts'
    }
  ];

  constructor(private rederer: Renderer2, private router: Router, private authService: AuthService) { // private location: Location
    // var pathString = location.path();
    //   console.log('appComponent: pathString...');
    //   console.log(pathString);


  }

  ngOnInit(): void {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        const currentsRoutes: string[] = e.url.split('/').join('?').split('?');
        const currentRoute = currentsRoutes[1];

        this.routes.forEach((route) => {
          if (route.route !== currentRoute) {
            route.active = false;
          } else {
            route.active = true;
          }

          if (route.items && Array.isArray(route.items) && route.items.length > 0) {
            route.items.forEach((childRoute) => {
              if (childRoute.route !== currentRoute) {
                childRoute.active = false;
              } else {
                childRoute.active = true;
                route.active = true;
              }
            });
          }
        });
      }

      this.user = this.authService.user;
      this.user
        .pipe(
          take(1)
        )
        .subscribe(user => {
          this.authService.getUserInfo();
        });
      this.authService.getUserInfo();
      this.userInfo = this.authService.userInfo;
    });
    // console.log(this.router.url);
    // // this.route. .url.subscribe(res => console.log(...res));
    // const modules: string[] = this.router.url.split('/').join('?').split('?');
    // console.log(modules[1]);
  }

  ngAfterViewInit() {
    const modules: string[] = this.router.url.split('/').join('?').split('?');
    console.log(modules[1]);
  }

  onHidden(): void {
    console.log('Dropdown is hidden');
  }
  onShown(): void {
    console.log('Dropdown is shown');
  }
  isOpenChange(): void {
    console.log('Dropdown state is changed');
  }

  linkTo(...routes: CustomRoute[]) {
    // console.log(routes);
    this.router.navigateByUrl(`${routes[0].route}?id=1`);

    // console.log(this.route.snapshot);
  }

  linkToAdmin(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.router.navigateByUrl(`admin-edit`);
  }
}
