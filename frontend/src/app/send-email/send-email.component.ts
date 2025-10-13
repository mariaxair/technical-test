import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.services';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css'],
})
export class SendEmailComponent implements OnInit {
  templates: any[] = [];
  recipients: any[] = [];
  selectedTemplateId: number | null = null;
  selectedRecipients: number[] = [];
  selectAll = false;
  isSending = false;
  testEmail = '';
  sendResults: any = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTemplates();
    this.loadRecipients();
  }

  loadTemplates() {
    this.apiService.getTemplates().subscribe(
      (data) => (this.templates = data),
      (error) => console.error('Error loading templates:', error)
    );
    this.cdr.detectChanges();
  }

  loadRecipients() {
    this.apiService.getValidRecipients().subscribe(
      (data) => (this.recipients = data),
      (error) => console.error('Error loading recipients:', error)
    );
    this.cdr.detectChanges();
  }

  toggleSelectAll() {
    if (this.selectAll) {
      this.selectedRecipients = this.recipients.map((r) => r.id);
    } else {
      this.selectedRecipients = [];
    }
    this.cdr.detectChanges();
  }

  toggleRecipient(id: number) {
    const index = this.selectedRecipients.indexOf(id);
    if (index > -1) {
      this.selectedRecipients.splice(index, 1);
    } else {
      this.selectedRecipients.push(id);
    }
    this.selectAll = this.selectedRecipients.length === this.recipients.length;
    this.cdr.detectChanges();
  }

  isSelected(id: number): boolean {
    return this.selectedRecipients.includes(id);
  }

  sendTestEmail() {
    if (!this.selectedTemplateId || !this.testEmail) {
      alert('Please select a template and enter a test email');
      return;
    }

    this.apiService.sendTestEmail(this.selectedTemplateId, this.testEmail).subscribe(
      () => {
        alert('Test email sent successfully!');
        this.testEmail = '';
      },
      (error) => {
        console.error('Error sending test email:', error);
        alert('Error sending test email');
      }
    );
  }

  sendBulkEmails() {
    if (!this.selectedTemplateId) {
      alert('Please select a template');
      return;
    }

    if (this.selectedRecipients.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    if (!confirm(`Send emails to ${this.selectedRecipients.length} recipient(s)?`)) {
      return;
    }

    this.isSending = true;
    this.sendResults = null;
    this.cdr.detectChanges(); // 🔹 Met à jour immédiatement l’état du bouton avant l’envoi

    this.apiService.sendBulkEmails(this.selectedTemplateId, this.selectedRecipients).subscribe({
      next: (results) => {
        this.isSending = false;
        this.sendResults = results;
        alert(`Emails sent successfully!\nSent: ${results.sent}\nFailed: ${results.failed}`);
        this.cdr.detectChanges(); // 🔹 Force Angular à rafraîchir la vue APRÈS réception
      },
      error: (error) => {
        this.isSending = false;
        console.error('Error sending bulk emails:', error);
        alert('Error sending bulk emails');
        this.cdr.detectChanges(); // 🔹 Force aussi la maj en cas d’erreur
      },
    });
  }

  get selectedTemplate() {
    return this.templates.find((t) => t.id === this.selectedTemplateId);
  }
}
