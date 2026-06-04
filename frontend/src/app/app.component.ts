import { Component, OnInit } from '@angular/core';
import { HotelService, Room, BookResult } from './hotel.service';

interface FloorRow {
  floor: number;
  rooms: Room[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  floors: FloorRow[] = [];
  roomsToBook = 1;
  lastBooked: number[] = [];
  message = '';
  error = '';
  loading = false;
  roomsLoading = false;

  constructor(private hotel: HotelService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  private render(rooms: Room[]): void {
    const grouped = new Map<number, Room[]>();
    for (const room of rooms) {
      if (!grouped.has(room.floor)) grouped.set(room.floor, []);
      grouped.get(room.floor)!.push(room);
    }
    // Top floor first so the visualization matches the building layout.
    this.floors = [...grouped.entries()]
      .map(([floor, list]) => ({
        floor,
        rooms: list.sort((a, b) => a.position - b.position),
      }))
      .sort((a, b) => b.floor - a.floor);
  }

  loadRooms(): void {
    this.roomsLoading = true;
    this.hotel.getRooms().subscribe({
      next: (rooms) => {
        this.render(rooms);
        this.roomsLoading = false;
      },
      error: () => {
        this.error = 'Cannot reach the API. Is the backend running?';
        this.roomsLoading = false;
      },
    });
  }

  book(): void {
    this.clearMessages();
    this.loading = true;
    this.hotel.book(this.roomsToBook).subscribe({
      next: (res: BookResult) => {
        this.lastBooked = res.bookedRooms;
        this.message = `Booked ${res.bookedRooms.join(', ')} — total travel time ${res.travelTime} min.`;
        this.loading = false;
        this.loadRooms();
      },
      error: (err) => {
        this.error = err?.error?.error || 'Booking failed.';
        this.loading = false;
      },
    });
  }

  random(): void {
    this.clearMessages();
    this.roomsLoading = true;
    this.hotel.random().subscribe({
      next: (rooms) => {
        this.render(rooms);
        this.roomsLoading = false;
      },
      error: () => {
        this.error = 'Could not generate random occupancy.';
        this.roomsLoading = false;
      },
    });
  }

  reset(): void {
    this.clearMessages();
    this.lastBooked = [];
    this.roomsLoading = true;
    this.hotel.reset().subscribe({
      next: (rooms) => {
        this.render(rooms);
        this.message = 'All bookings cleared.';
        this.roomsLoading = false;
      },
      error: () => {
        this.error = 'Could not reset bookings.';
        this.roomsLoading = false;
      },
    });
  }

  isJustBooked(room: Room): boolean {
    return this.lastBooked.includes(room.roomNumber);
  }

  private clearMessages(): void {
    this.message = '';
    this.error = '';
  }
}
