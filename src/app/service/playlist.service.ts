import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Playlist} from '../model/Playlist';
import {Song} from '../model/Song';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private api = 'http://localhost:8080/v1/api/library';

  constructor(private http: HttpClient) {}

  getUserLibrary(userId: number): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.api}/${userId}`);
  }

  createUserLibrary(userId: number): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.api}/${userId}`, {});
  }

  addSong(userId: number, song: Song): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.api}/${userId}/add-song`, song);
  }

  removeSong(userId: number, songId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${this.api}/${userId}/remove-song/${songId}`);
  }

  clearLibrary(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${userId}/clear`);
  }
}
