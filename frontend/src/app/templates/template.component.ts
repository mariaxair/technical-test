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
    this.apiService.getTemplates().subscribe({
      next: (data) => {
        console.log('Templates loaded:', data);
        this.templates = data;
        this.cdr.detectChanges(); // force le rafraîchissement de la vue
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        alert('Error loading templates. Check console for details.');
      },
    });
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
