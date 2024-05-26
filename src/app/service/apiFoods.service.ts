import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiFoodsService {
  constructor(private http: HttpClient) {}

  searchProducts(productName: string): Observable<any[]> {
    return this.http.get<any[]>(`https://alimenticia-api-62c500e9b184.herokuapp.com/apiFoods?nombre=${encodeURIComponent(productName)}`);
  }
}
