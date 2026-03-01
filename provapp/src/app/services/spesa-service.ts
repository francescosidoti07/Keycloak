import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Observable } from 'rxjs';

// Definiamo un'interfaccia per il nostro Item
export interface ShoppingItem {
  id: number;
  item: string;
}

@Injectable({ providedIn: 'root' })
export class SpesaService {
  private http = inject(HttpClient);
  private keycloak = inject(Keycloak);
  private baseUrl = 'https://stunning-winner-5gv7v6p97j5w24xx9-5000.app.github.dev';
  
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.keycloak.token}`,
    });
  }

  getItems(): Observable<{ items: ShoppingItem[]; user: string }> {
    return this.http.get<{ items: ShoppingItem[]; user: string }>(
      `${this.baseUrl}/items`,
      { headers: this.getHeaders() }
    );
  }

  addItem(item: string): Observable<{ items: ShoppingItem[] }> {
    return this.http.post<{ items: ShoppingItem[] }>(
      `${this.baseUrl}/items`,
      { item },
      { headers: this.getHeaders() }
    );
  }

  // Nuovo metodo per l'eliminazione
  deleteItem(id: number): Observable<{ items: ShoppingItem[] }> {
    return this.http.delete<{ items: ShoppingItem[] }>(
      `${this.baseUrl}/items/${id}`,
      { headers: this.getHeaders() }
    );
  }
}