import { Component } from '@angular/core';
import { LogoComponent } from './logo/logo.component';
import { Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [LogoComponent, AsyncPipe, DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  currentDate$: Observable<Date>;

  constructor() {
    this.currentDate$ = interval(1000).pipe(
      startWith(0),
      map(() => new Date())
    );
  }
}
