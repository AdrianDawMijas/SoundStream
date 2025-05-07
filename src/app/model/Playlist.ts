import {Song} from './Song';

export interface Playlist {
  id: number;
  user: any; // o User
  songs: Song[];
  createdAt: string;
}
