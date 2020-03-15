import { Component, OnInit, ElementRef, ViewChild, Renderer2, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.sass']
})
export class CarouselComponent implements OnInit {
  currentSlideIndex = 2;

  @Input() items: any[];

  @ContentChild(TemplateRef) template: TemplateRef<any>;

  @ViewChild('carouselRef', { read: ElementRef }) carouselRef: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.currentSlideIndex = this.items.length - 2;
  }

  activeSlideChange(slideIndex) {
    if (!this.carouselRef || !this.carouselRef.nativeElement) {
      return;
    }

    if (
      (slideIndex === 0 && this.currentSlideIndex === 3) ||
      (slideIndex > this.currentSlideIndex && !(slideIndex === 3 && this.currentSlideIndex === 0))
    ) {
      this.renderer.removeClass(this.carouselRef.nativeElement, 'slide-animated-left');
      this.renderer.addClass(this.carouselRef.nativeElement, 'slide-animated-right');
    }

    if (
      (slideIndex === 3 && this.currentSlideIndex === 0) ||
      (slideIndex < this.currentSlideIndex && !(slideIndex === 0 && this.currentSlideIndex === 3))
    ) {
      this.renderer.addClass(this.carouselRef.nativeElement, 'slide-animated-left');
      this.renderer.removeClass(this.carouselRef.nativeElement, 'slide-animated-right');
    }

    this.currentSlideIndex = slideIndex;
  }
}
