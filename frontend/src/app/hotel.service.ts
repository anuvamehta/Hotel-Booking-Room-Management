import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  roomNumber: number;
  floor: number;
  position: number;
  isBooked: boolean;
}

export interface BookResult {
  bookedRooms: number[];
  travelTime: number;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  private readonly base = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.base}/rooms`);
  }

  book(count: number): Observable<BookResult> {
    return this.http.post<BookResult>(`${this.base}/book`, { count });
  }

  random(): Observable<Room[]> {
    return this.http.post<Room[]>(`${this.base}/random`, {});
  }

  reset(): Observable<Room[]> {
    return this.http.post<Room[]>(`${this.base}/reset`, {});
  }
}
