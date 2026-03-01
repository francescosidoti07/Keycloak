import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpesaService, ShoppingItem } from '../../services/spesa-service';

@Component({
  selector: 'app-lista-spesa',
  imports: [FormsModule],
  templateUrl: './lista-spesa.html',
  styleUrl: './lista-spesa.css'
})
export class ListaSpesa implements OnInit {
  private spesaService = inject(SpesaService);
  
  // Cambiamo il tipo da string[] a ShoppingItem[]
  items = signal<ShoppingItem[]>([]);
  newItem = signal('');
  error = signal('');

  ngOnInit(): void {
    this.spesaService.getItems().subscribe({
      next: (res: { items: ShoppingItem[]; }) => this.items.set(res.items),
      error: () => this.error.set('Errore nel caricamento della lista'),
    });
  }

  addItem(): void {
    if (!this.newItem().trim()) return;
    this.spesaService.addItem(this.newItem().trim()).subscribe({
      next: (res: { items: ShoppingItem[]; }) => {
        this.items.set(res.items);
        this.newItem.set('');
        this.error.set('');
      },
      error: () => this.error.set("Errore durante l'aggiunta"),
    });
  }

  // Nuovo metodo per eliminare
  deleteItem(id: number): void {
    this.spesaService.deleteItem(id).subscribe({
      next: (res: { items: ShoppingItem[]; }) => {
        this.items.set(res.items);
        this.error.set('');
      },
      error: () => this.error.set("Errore durante l'eliminazione"),
    });
  }
}