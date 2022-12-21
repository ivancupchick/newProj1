import {
  Component,
  OnInit,
  Renderer2,
  AfterViewInit,
  TemplateRef
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService, UserInfo } from 'src/app/services/auth.service';
import firebase from 'firebase/compat/app';
import { PopoverDirective } from 'ngx-bootstrap/popover/public_api';
import { Model, MarksService, Mark, MarkWithKey } from 'src/app/services/marks.service';

function getParentsOfTarget(event: Event): HTMLElement[] {
  return (event as any).path
    ? (event as any).path
    : event.composedPath
      ? event.composedPath()
      : composedPath(event.target as Element);
}

function composedPath(el: Element): (Element | Document | (Window & typeof globalThis))[] {
    const path: (Element | Document | (Window & typeof globalThis))[] = [];

    while (el) {
      path.push(el);

      if (el.tagName === 'HTML') {
        path.push(document);
        path.push(window);

        return path;
      }

      if (el.parentElement) {
        el = el.parentElement;
      } else {
        return path;
      }
    }

    return path
}

// function eventInTarget(event: MouseEvent, targetRef: TemplateRef<any> | HTMLElement): boolean {
//   const target: Element = !(targetRef instanceof TemplateRef)
//     ? targetRef
//     : (targetRef.elementRef.nativeElement as Comment).nextElementSibling;

//   const targetRect = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;

//   if (!targetRect) {
//     return false;
//   }

//   if (event.pageX >= targetRect.left && event.pageX <= targetRect.right &&
//       event.pageY >= targetRect.top && event.pageY <= targetRect.bottom) {
//     let isEventInTarget = false;

//     const parents = getParentsOfTarget(event);

//     if (!parents) {
//       return false;
//     }

//     parents.find((item: HTMLElement) => {
//       if (!item || item === document.body) {
//         return true;
//       }

//       if (!!item && (target === item)) {
//         isEventInTarget = true;
//         return true;
//       } else {
//         return false;
//       }
//     });

//     return !!isEventInTarget;
//   } else {
//     return false;
//   }
// }

interface CustomRoute {
  name: string;
  active: boolean;
  route: string;
  items?: CustomRoute[];
  custumParams?: any;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user: Observable<firebase.User | null> = new Observable<firebase.User | null>;
  userInfo: BehaviorSubject<UserInfo | null> = new BehaviorSubject<UserInfo | null>(null);

  marks: Mark[] = [];

  poppovers: { popoverComponent: PopoverDirective, eventInitiator: HTMLElement, popoverRef: TemplateRef<any> }[] = [];

  routes: CustomRoute[] = [{
    name: 'Главная', active: false, route: ''
  }, {
      name: 'Новые автомобили',
      active: false,
      route: 'new-cars',
      items: [
        { name: 'Кроссоверы', active: false, route: 'crossover', custumParams: { models: [] } },
        { name: 'Универсалы', active: false, route: 'universal', custumParams: { models: [] } },
        { name: 'Седаны', active: false, route: 'sedan', custumParams: { models: [] } },
        { name: 'Минивэны', active: false, route: 'minivan', custumParams: { models: [] } },
        { name: 'Хэтчбэки', active: false, route: 'hatchback', custumParams: { models: [] } }
      ]
    }, {
      name: 'Финансирование',
      active: false,
      route: 'funding',
      items: [
        { name: 'Условия', active: false, route: 'finance-conditions' },
        { name: 'Расчет', active: false, route: 'finance-calculator' }
      ]
    }, {
      name: 'Трейд-ин', active: false, route: 'trade-in'
    }, {
      name: 'Гарантия', active: false, route: 'guarantee'
    }, {
      name: 'Контакты', active: false, route: 'contacts'
    }
  ];

  constructor(
    // private renderer: Renderer2,
    private router: Router,
    private authService: AuthService,
    private marksService: MarksService
  ) {}

  ngOnInit(): void {
    this.marksService.getMarks().subscribe(marks => {
      this.marks = marks.map(m => m.mark);
      let allModels: Model[] = [];
      this.marks.forEach(mark => {
        allModels = [
          ...allModels,
          ...(
            (mark &&
              mark.models
                .map(
                  m => Object.assign({}, m, { name: `${mark.name} ${m.name}` })
                )
            ) || []
          )
        ];
      });

      const routeNewCars = this.routes.find(r => r.route === 'new-cars');

      if (!routeNewCars) {
        return;
      }

      routeNewCars.items?.forEach(route => {
        if (route && route.custumParams && route.custumParams.models) {
          route.custumParams.models = [];
        }
      });

      allModels.forEach(model => {
        const type = (model.attributes || []).find(attribute => attribute.name === 'Тип кузова');
        const typeValue = type ? type.value : null;

        const pushModel = (path: string) => {
          const route = routeNewCars.items?.find(r => r.route === path);
          if (route && route.custumParams && route.custumParams.models) {
            route.custumParams.models.push(model);
          }
        };

        switch (typeValue) {
          case 'Кроссовер': pushModel('crossover'); break;
          case 'Универсал': pushModel('universal'); break;
          case 'Седан': pushModel('sedan'); break;
          case 'Минивэн': pushModel('minivan'); break;
          case 'Хэтчбэк': pushModel('hatchback'); break;
        }
      });
    });

    // this.renderer.listen('document', 'mouseover', (e: MouseEvent) => this.mouseOver(e) );

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
      this.authService.userInfo.subscribe(info => {
        this.userInfo.next(info);
      })
      this.userInfo.next(this.authService.userInfo.getValue());
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

  registerPopover(popover: PopoverDirective, eventInitiator: HTMLElement, popoverRef: TemplateRef<any>) {
    const notIs = !this.poppovers.find(p => p.popoverComponent === popover);
    if (this.poppovers.length > 0 && notIs) {
      this.poppovers = this.poppovers.filter(savedPopover => {
        savedPopover.popoverComponent.hide();

        return false;
      });
    }

    if (notIs) {
      this.poppovers.push({ popoverComponent: popover, eventInitiator, popoverRef });

      popover.onHidden.pipe(take(1)).subscribe(hide => {
        this.poppovers = this.poppovers.filter(savedPopover => savedPopover.popoverComponent !== popover);
      });

      popover.show();
    }
  }

  onHiddenDropdown() {
    this.poppovers = this.poppovers.filter(popover => {
      popover.popoverComponent.hide();
      return false;
    });
  }

  mouseOver(e: MouseEvent) {
    // if (this.poppovers.length > 0) {
    //   this.poppovers = this.poppovers.filter(popover => {
    //     if (eventInTarget(e, popover.popoverRef) || eventInTarget(e, popover.eventInitiator)) {
    //       return true;
    //     } else {
    //       popover.popoverComponent.hide();
    //       return false;
    //     }
    //   });
    // }
  }

  linkTo(...routes: CustomRoute[]) {
    let url: string = routes[0].route;
    if (routes.length > 1) {
      if (routes[0].route === 'funding') {
        url = routes[1].route;
      } else {
        url += `?type=${routes
          .filter((v, i) => i !== 0)
          .map(r => r.route)
          .join(',')}`;
      }
    }
    this.router.navigateByUrl(url);
  }

  linkToAdmin(e: Event) {
    e.stopPropagation();
    e.preventDefault();

    this.router.navigateByUrl(`admin-edit`);
  }

  linkToModelPresentation(model: Model) {
    this.marks.find((ma, maI) => {
      const idMarkModel = ma.models.findIndex(mo => mo.mainPhoto === model.mainPhoto);

      if (idMarkModel !== -1) {
        this.router.navigateByUrl(`model-presentation?idMark=${maI}&idModel=${idMarkModel}`);
        return true;
      }
      return false;
    });
  }
}
