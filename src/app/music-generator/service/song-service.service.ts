// song.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SongDTO {
  genre: string | null;
  subgenre: string | null;
  duration: number | null;
  tempo: number | null;
  // instrumentNames: string[] | null;
  promptText: string;
  userId: number;
}

@Injectable({ providedIn: 'root' })
export class SongService {
  private apiUrl = 'https://soundstream-backend-gt2y.onrender.com/v1/api/songs/generate';

  constructor(private http: HttpClient) {}

  generateSong(song: {
    genre: string | null;
    subgenre: string | null;
    duration: number | null;
    tempo: number | null;
    promptText: string;
    userId: number;
  }): Observable<any> {

    return this.http.post(this.apiUrl, song);
  }
}
