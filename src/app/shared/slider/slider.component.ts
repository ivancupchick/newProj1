import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.sass']
})
export class SliderComponent implements OnInit {
  @Input() set step(value: string | number) {
    this.stepValue = typeof value === 'string' ? +value : value;
  }
  @Input() set max(value: string | number) {
    this.maxValue = typeof value === 'string' ? +value : value;
  }
  @Input() set min(value: string | number) {
    this.minValue = typeof value === 'string' ? +value : value;
  }

  @ViewChild('slider', { static: true }) slider!: ElementRef;
  @ViewChild('range', { static: true }) range!: ElementRef;
  @ViewChild('thumb', { static: true }) thumb!: ElementRef;

  @Output() changeValue: EventEmitter<number> = new EventEmitter<number>();

  public ticks: { label: string, value: number }[] = [];

  public calculatedPaddingLeft = '0px';
  public calculatedPaddingRight = '0px';

  private maxValue = 1;
  private minValue = 0;
  private stepValue = 1;

  private value = 0;
  private minRectValue = 0;
  private maxRectValue = 0;

  @Input() historyTemplate!: (num: number) => string;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    this.registerListeners();
    this.setSettings();
  }

  private setSettings() {
    if (this.historyTemplate) {
      const ticks: { label: string, value: number }[] = [];

      for (let i = this.minValue; i <= this.maxValue; i += this.stepValue) {
        const text = this.historyTemplate(i);

        if (text) {
          ticks.push({
            label: text,
            value: i
          });
        }

      }

      this.ticks = ticks;

      if (ticks.length !== 2) {
        this.calculatedPaddingLeft = '4px';
        this.calculatedPaddingRight = '10px';
      }


      setTimeout(() => {
        const tickss: HTMLElement = this.renderer.nextSibling(this.slider.nativeElement);
        const firstTick: HTMLElement = (tickss.firstChild as HTMLElement);

        if (firstTick) {
          // console.log(firstTick.getBoundingClientRect().width);
        }
      });
    }
  }

  private registerListeners() {
    const slider = this.slider.nativeElement;
    const range = this.range.nativeElement;
    const thumb = this.thumb.nativeElement;

    const thumbWidth = thumb.getBoundingClientRect().width;
    this.minRectValue = 0;
    this.maxRectValue = range.getBoundingClientRect().width - thumbWidth; // replace to document.resize

    let stepInPx: number = this.maxRectValue / ((this.maxValue - this.minValue) / this.stepValue);

    slider.addEventListener('change', () => { // may not need
      stepInPx = this.maxRectValue / ((this.maxValue - this.minValue) / +this.stepValue);

      this.moveThumbToPostion(this.value, stepInPx);
    });


    const dragStart = (event: MouseEvent | TouchEvent) => {
      const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const pageX = event instanceof MouseEvent ? event.pageX : event.touches[0].pageX;

      const shiftX = clientX - thumb.getBoundingClientRect().left;

      const x = pageX - range.getBoundingClientRect().left;

      const moveAt = (localX: number) => {
        const needX = localX - shiftX;
        this.moveThumbToPostion(needX, stepInPx);
      };

      moveAt(x);



      function onMouseMove(e: MouseEvent | TouchEvent) {
        if (e instanceof TouchEvent) {
          e.preventDefault();
        }
        const localPageX = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;

        const localX = localPageX - range.getBoundingClientRect().left;

        moveAt(localX);
      }

      if (event instanceof MouseEvent) {
        document.addEventListener('mousemove', onMouseMove);
      } else {
        document.addEventListener('touchmove', onMouseMove);
      }

      if (event instanceof MouseEvent) {
        document.addEventListener('mouseup', dragEnd);
      } else {
        document.addEventListener('touchend', dragEnd);
      }

      function dragEnd(e: MouseEvent | TouchEvent) {
        if (e instanceof MouseEvent) {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', dragEnd);
        } else {
          e.preventDefault();
          document.removeEventListener('touchmove', onMouseMove);
          document.removeEventListener('touchend', dragEnd);
        }
      }
    };

    thumb.addEventListener('mousedown', dragStart);
    thumb.addEventListener('touchstart', dragStart);

    slider.addEventListener('click', (event: MouseEvent) => {
      const x = event.pageX - range.getBoundingClientRect().left;

      this.moveThumbToPostion(x - (thumbWidth / 2), stepInPx);
    });
  }

  moveThumbToPostion(needX: number, stepInPx: number) {
    needX = this.setValueBetweenRange(needX);

    needX = needX / stepInPx;
    needX = Math.round(needX);
    const value = this.minValue + (needX * +this.stepValue);

    this.setSliderValue(value);
  }

  moveTrueThumbToPostion() {
    const stepInPx = this.maxRectValue / ((this.maxValue - this.minValue) / this.stepValue);
    const thumbWidth = this.thumb.nativeElement.getBoundingClientRect().width;

    let needX = this.value;
    needX = (needX - +this.minValue) / +this.stepValue;

    needX *= stepInPx;

    needX = this.setValueBetweenRange(needX);

    const needXWithPx = needX + 'px';
    this.range.nativeElement.style.background = `
      linear-gradient(to right, #0db9f0 ${needX + (thumbWidth / 2) + 'px'}, #d8e0f3 ${needX + (thumbWidth / 2)  + 'px'})
    `;
    this.thumb.nativeElement.style.left = needXWithPx;
  }

  setValueBetweenRange(needX: number) {
    return needX < this.minRectValue ? this.minRectValue : needX > this.maxRectValue ? this.maxRectValue : needX;
  }

  setSliderValue(v: number) {
    // console.log(v);
    this.value = v;
    this.changeValue.emit(v);
    this.moveTrueThumbToPostion();
  }

}
