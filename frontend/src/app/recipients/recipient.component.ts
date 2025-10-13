import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.services';

@Component({
  selector: 'app-recipients',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.css'],
})
export class RecipientComponent implements OnInit {
  recipients: any[] = [];
  filteredRecipients: any[] = [];
  searchTerm: string = ''; // texte saisi par l’utilisateur
  showForm = false;
  editingRecipient: any = null;
  selectedFile: File | null = null;

  formData = {
    email: '',
    name: '',
    metadata: {},
  };

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {} // sert a injecter les dependances necessaires au composant

  ngOnInit() {
    console.log('RecipientsComponent initialized');
    this.loadRecipients();
  }

  loadRecipients() {
    console.log('Loading recipients...');
    this.apiService.getRecipients().subscribe({
      next: (data) => {
        console.log('Recipients loaded:', data);
        this.recipients = data;
        this.filteredRecipients = [...data];
        this.cdr.detectChanges(); // force le rafraîchissement de la vue
      },
      error: (error) => {
        console.error('Error loading recipients:', error);
        alert('Error loading recipients. Check console for details.');
      },
    });
  }

  loadFilteredRecipients() {
    console.log('Loading filtered recipients...');
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredRecipients = [...this.recipients]; // aucun filtre encore car term est vide
      this.cdr.detectChanges();
      return;
    }

    this.filteredRecipients = this.recipients.filter(
      (r) => r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term)
    )
    this.cdr.detectChanges();
  }

  openForm(recipient?: any) {
    if (recipient) {
      this.editingRecipient = recipient;
      this.formData = { ...recipient };
    } else {
      this.editingRecipient = null;
      this.formData = { email: '', name: '', metadata: {} };
    }
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingRecipient = null;
    this.cdr.detectChanges();
  }

  saveRecipient() {
    if (this.editingRecipient) {
      this.apiService.updateRecipient(this.editingRecipient.id, this.formData).subscribe({
        next: () => {
          this.loadRecipients();
          this.closeForm();
        },
        error: (err) => console.error('Error updating recipient:', err),
      });
    } else {
      this.apiService.createRecipient(this.formData).subscribe({
        next: () => {
          this.loadRecipients();
          this.closeForm();
        },
        error: (err) => console.error('Error creating recipient:', err),
      });
    }
    this.cdr.detectChanges();
  }

  deleteRecipient(id: number) {
    if (confirm('Are you sure you want to delete this recipient?')) {
      this.apiService.deleteRecipient(id).subscribe({
        next: () => this.loadRecipients(),
        error: (err) => console.error('Error deleting recipient:', err),
      });
    }
    this.cdr.detectChanges();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  importCSV() {
    if (this.selectedFile) {
      this.apiService.importRecipients(this.selectedFile).subscribe({
        next: (response) => {
          alert(`Successfully imported ${response.insertedCount} recipients`);
          this.loadRecipients();
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('Error importing recipients:', err);
          alert('Error importing recipients');
        },
      });
    }
  }
}
