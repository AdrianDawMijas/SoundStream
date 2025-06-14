import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Playlist } from '../model/Playlist';
import { Song } from '../model/Song';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private api = 'https://soundstream-backend-gt2y.onrender.com/v1/api/songs';

  constructor(private http: HttpClient) {}

  // ──────────────── LISTADO DE CANCIONES ────────────────

  // Obtiene todas las canciones generadas por un usuario concreto
  getSongsByUser(userId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`https://soundstream-backend-gt2y.onrender.com/v1/api/songs/user/${userId}`);
  }

  // Obtiene todas las canciones disponibles (solo admins)
  getAllSongs(): Observable<Song[]> {
    return this.http.get<Song[]>('https://soundstream-backend-gt2y.onrender.com/v1/api/songs');
  }

  // ──────────────── GESTIÓN DE PLAYLISTS ────────────────

  // Crea la biblioteca (playlist) del usuario tras registrarse
  createUserLibrary(userId: number): Observable<Playlist> {
    return this.http.post<Playlist>(`${this.api}/${userId}`, {});
  }

  // Añade una canción existente a la playlist del usuario
  addSong(userId: number, song: Song): Observable<void> {
    return this.http.post<void>(`${this.api}/user/${userId}/add`, {
      songId: song.id
    });
  }

  // Elimina una canción de la playlist del usuario
  removeSong(songId: number): Observable<Playlist> {
    return this.http.delete<Playlist>(`${this.api}/${songId}`);
  }

  // Borra todas las canciones de la playlist del usuario
  clearLibrary(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${userId}/clear`);
  }

  // ──────────────── FILTRADO DE CANCIONES ────────────────

  // Devuelve las canciones del usuario aplicando múltiples filtros
  getFilteredSongsByUser(
    userId: number,
    genreId?: number,
    subgenreId?: number,
    minDuration?: number,
    maxDuration?: number,
    instrumentIds?: number[]
  ): Observable<Song[]> {
    const params: any = {};

    if (genreId) params.genreId = genreId;
    if (subgenreId) params.subgenreId = subgenreId;
    if (minDuration) params.minDuration = minDuration;
    if (maxDuration) params.maxDuration = maxDuration;
    if (instrumentIds && instrumentIds.length > 0) {
      params.instrumentIds = instrumentIds.join(',');
    }

    return this.http.get<Song[]>(`https://soundstream-backend-gt2y.onrender.com/v1/api/songs/user/${userId}/filter`, { params });
  }
}
