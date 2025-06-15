export interface Instrument {
  id: number;
  name: string;
}

export interface Song {
  id: number;
  title: string;
  duration: number | string;
  tempo?: number; // tu backend usa Integer
  generatedUrl: string;
  promptText?: string;
  genre?: { name: string };
  subgenre?: { name: string };
  // instruments?: Instrument[];
}
