import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit {
  templates: any[] = [];
  filteredTemplates: any[] = []; // liste filtrée
  searchTerm: string = ''; // texte saisi par l’utilisateur
  page: number = 1;
  limit: number = 10;
  pagination: any = {};
  showForm = false;
  editingTemplate: any = null;

  formData = {
    name: '',
    subject: '',
    body: '',
    variables: [],
  };

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('TemplatesComponent initialized');
    this.loadTemplates();
  }

  loadTemplates() {
    console.log('Loading templates...');
    this.apiService.getTemplates(this.page, this.limit).subscribe({
      next: (res) => {
        console.log('Templates loaded:', res.data);
        this.templates = res.data;
        this.filteredTemplates = [...res.data];
        this.pagination = res.pagination;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        alert('Error loading templates. Check console for details.');
      },
    });
  }

  filterTemplates() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredTemplates = [...this.templates]; // aucun filtre encore
      this.cdr.detectChanges();
      return;
    }

    this.filteredTemplates = this.templates.filter(
      (t) => t.name.toLowerCase().includes(term) || t.subject.toLowerCase().includes(term)
    );

    this.cdr.detectChanges();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadTemplates();
    }
  }

  nextPage() {
    if (this.page < this.pagination.totalPages) {
      this.page++;
      this.loadTemplates();
    }
  }

  openForm(template?: any) {
    if (template) {
      this.editingTemplate = template;
      this.formData = { ...template };
    } else {
      this.editingTemplate = null;
      this.formData = { name: '', subject: '', body: '', variables: [] };
    }
    this.showForm = true;
    this.cdr.detectChanges();
  }

  closeForm() {
    this.showForm = false;
    this.editingTemplate = null;
    this.cdr.detectChanges();
  }

  saveTemplate() {
    if (this.editingTemplate) {
      this.apiService.updateTemplate(this.editingTemplate.id, this.formData).subscribe(
        () => {
          this.loadTemplates();
          this.closeForm();
        },
        (error) => console.error('Error updating template:', error)
      );
    } else {
      this.apiService.createTemplate(this.formData).subscribe(
        () => {
          this.loadTemplates();
          this.closeForm();
        },
        (error) => console.error('Error creating template:', error)
      );
    }
    this.cdr.detectChanges();
  }

  deleteTemplate(id: number) {
    if (confirm('Are you sure you want to delete this template?')) {
      this.apiService.deleteTemplate(id).subscribe(
        () => this.loadTemplates(),
        (error) => console.error('Error deleting template:', error)
      );
    }
    this.cdr.detectChanges();
  }
}
