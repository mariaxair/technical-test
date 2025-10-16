import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private baseUrl = 'http://localhost:3000/api'; //for local
  // private baseUrl = 'http://10.0.2.2:3000/api'; //for emulation
  private baseUrl = 'http://192.168.1.75:3000/api'; //replace with your ip
  constructor(private http: HttpClient) {
    console.log('ApiService initialized with baseUrl:', this.baseUrl);
  }

  // Templates
  getTemplates(page = 1, limit = 10, search = ''): Observable<any> {
    console.log('API: GET templates');
    const params = { page, limit, search };
    return this.http.get(`${this.baseUrl}/templates`, { params }).pipe(
      tap((data) => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  getTemplatesForSelection(): Observable<any> {
    console.log('API: GET templates');
    return this.http.get(`${this.baseUrl}/templates/selection`).pipe(
      tap((data) => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  createTemplate(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/templates`, data);
  }

  updateTemplate(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/templates/${id}`, data);
  }

  deleteTemplate(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/templates/${id}`);
  }

  // Recipients
  getRecipients(page = 1, limit = 10, search = ''): Observable<any> {
    console.log('API: GET recipients');
    const params = { page, limit, search };
    return this.http.get(`${this.baseUrl}/recipients`, { params }).pipe(
      tap((data) => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  getValidRecipients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/recipients/valid`).pipe(catchError(this.handleError));
  }

  createRecipient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recipients`, data);
  }

  updateRecipient(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/recipients/${id}`, data);
  }

  deleteRecipient(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/recipients/${id}`);
  }

  importRecipients(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/recipients/import`, formData);
  }

  // Emails
  sendBulkEmails(templateId: number, recipientIds?: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/emails/send-bulk`, {
      templateId,
      recipientIds,
    });
  }

  sendTestEmail(templateId: number, testEmail: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/emails/test`, {
      templateId,
      testEmail,
    });
  }

  // History
  getHistory(page = 1, limit = 10, search = ''): Observable<any> {
    const params = { page, limit, search };
    return this.http.get(`${this.baseUrl}/history`, { params }).pipe(
      tap((data) => console.log('API Response:', data)),
      catchError(this.handleError)
    );
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/history/stats`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
