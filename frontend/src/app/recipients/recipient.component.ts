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
  // filteredRecipients: any[] = [];
  page: number = 1;
  limit: number = 10;
  pagination: any = {};
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
    this.apiService.getRecipients(this.page, this.limit, this.searchTerm).subscribe({
      next: (res) => {
        console.log('Recipients loaded:', res.data);
        this.recipients = res.data;
        this.pagination = res.pagination;
        // this.filteredRecipients = [...data];
        this.cdr.detectChanges(); // force le rafraîchissement de la vue
      },
      error: (error) => {
        console.error('Error loading recipients:', error);
        alert('Error loading recipients. Check console for details.');
      },
    });
  }


  onSearchChange() {
    this.page = 1;
    this.loadRecipients();
  }

  goToPage(page: number) {
    this.page = page;
    this.loadRecipients();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadRecipients();
    }
  }

  nextPage() {
    if (this.page < this.pagination.totalPages) {
      this.page++;
      this.loadRecipients();
    }
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
