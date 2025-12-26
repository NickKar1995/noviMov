import { Injectable, signal } from '@angular/core';

import { Movie } from '../../search-page/models/Movie';
import { MovieCollection } from '../models/MovieCollection';
import { CreateCollectionDto } from '../models/CreateCollectionDto';
import { UpdateCollectionDto } from '../models/UpdateCollectionDto';

const COLLECTIONS_STORAGE_KEY = 'noviMov_collections';

@Injectable({
  providedIn: 'root',
})
export class CollectionsService {
  readonly collections = signal<MovieCollection[]>([]);

  constructor() {
    this.loadCollections();
  }

  private loadCollections(): void {
    const stored = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (stored) {
      try {
        const collections = JSON.parse(stored) as MovieCollection[];
        this.collections.set(collections);
      } catch (error) {
        console.error('Failed to load collections:', error);
        this.collections.set([]);
      }
    }
  }

  private saveCollections(): void {
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(this.collections()));
  }

  createCollection(dto: CreateCollectionDto): MovieCollection {
    const newCollection: MovieCollection = {
      id: this.generateId(),
      title: dto.title,
      description: dto.description,
      movies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.collections.update((collections) => [...collections, newCollection]);
    this.saveCollections();
    return newCollection;
  }

  getCollection(id: string): MovieCollection | undefined {
    return this.collections().find((c) => c.id === id);
  }

  updateCollection(id: string, dto: UpdateCollectionDto): MovieCollection | null {
    const collection = this.getCollection(id);
    if (!collection) {
      return null;
    }

    const updatedCollection: MovieCollection = {
      ...collection,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    this.collections.update((collections) =>
      collections.map((c) => (c.id === id ? updatedCollection : c)),
    );
    this.saveCollections();
    return updatedCollection;
  }

  deleteCollection(id: string): boolean {
    const exists = this.collections().some((c) => c.id === id);
    if (!exists) {
      return false;
    }

    this.collections.update((collections) => collections.filter((c) => c.id !== id));
    this.saveCollections();
    return true;
  }

  addMoviesToCollection(collectionId: string, movies: Movie[]): boolean {
    const collection = this.getCollection(collectionId);
    if (!collection) {
      return false;
    }

    // Filter out movies that are already in the collection
    const existingIds = new Set(collection.movies.map((m) => m.id));
    const newMovies = movies.filter((m) => !existingIds.has(m.id));

    if (newMovies.length === 0) {
      return true;
    }

    const updatedCollection: MovieCollection = {
      ...collection,
      movies: [...collection.movies, ...newMovies],
      updatedAt: new Date().toISOString(),
    };

    this.collections.update((collections) =>
      collections.map((c) => (c.id === collectionId ? updatedCollection : c)),
    );
    this.saveCollections();
    return true;
  }

  removeMovieFromCollection(collectionId: string, movieId: number): boolean {
    const collection = this.getCollection(collectionId);
    if (!collection) {
      return false;
    }

    const updatedCollection: MovieCollection = {
      ...collection,
      movies: collection.movies.filter((m) => m.id !== movieId),
      updatedAt: new Date().toISOString(),
    };

    this.collections.update((collections) =>
      collections.map((c) => (c.id === collectionId ? updatedCollection : c)),
    );
    this.saveCollections();
    return true;
  }

  isMovieInCollection(collectionId: string, movieId: number): boolean {
    const collection = this.getCollection(collectionId);
    return collection ? collection.movies.some((m) => m.id === movieId) : false;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
