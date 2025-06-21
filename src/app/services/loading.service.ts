import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  private requestCount = 0;

  show(): void {
    this.requestCount++;
    this.loading.next(true);
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount === 0) {
      this.loading.next(false);
    }
  }
}
