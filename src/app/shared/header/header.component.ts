import { Component, OnInit, ViewChild, Renderer2, ElementRef, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @ViewChild('mobileButton') mobileButton: ElementRef<HTMLButtonElement>;
  @ViewChild('navList') navList: ElementRef<HTMLElement>;

  @ViewChildren('ddNavItem') dropDownNavItems: ElementRef<HTMLElement>[];

  constructor(private rederer: Renderer2) { }

  ngOnInit(): void {
  }

  toogleMobileNav(e: Event) {
    const COLLAPSEDCLASS = 'collapsed';
    console.log(this.mobileButton);
    console.log(this.navList);
    if (this.mobileButton.nativeElement.classList.contains(COLLAPSEDCLASS)) { // show
      this.rederer.removeClass(this.mobileButton.nativeElement, COLLAPSEDCLASS);
      this.rederer.addClass(this.navList.nativeElement, 'show');
    } else { // hide
      this.rederer.addClass(this.mobileButton.nativeElement, COLLAPSEDCLASS);
      this.rederer.removeClass(this.navList.nativeElement, 'show');
    }
  }

  showDropDown(e: Event) {
    const dropDownA: HTMLElement = (e.target as HTMLElement);
    const parentDropDownA: HTMLElement = this.rederer.parentNode(dropDownA);
    const menuDropDownA: HTMLElement = this.rederer.nextSibling(dropDownA);

    if (parentDropDownA.classList.contains('show')) {
      this.rederer.removeClass(parentDropDownA, 'show');
      this.rederer.removeClass(menuDropDownA, 'show');
    } else {
      this.rederer.addClass(parentDropDownA, 'show');
      this.rederer.addClass(menuDropDownA, 'show');
    }
  }
}
