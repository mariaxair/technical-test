import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../services/api.services';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  // filteredHistory: any[] = [];
  page: number = 1;
  limit: number = 10;
  pagination: any = {};
  searchTerm: string = '';
  statistics: any = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadHistory();
    this.loadStatistics();
  }

  loadHistory() {
    console.log('Loading history...');
    this.apiService.getHistory(this.page, this.limit, this.searchTerm).subscribe({
      next: (res) => {
        console.log('History loaded:', res.data);
        this.history = res.data;
        this.pagination = res.pagination;
        // this.filteredHistory = [...res.data]; // initialement, pas de filtre
        this.cdr.detectChanges(); // force Angular à mettre à jour la vue immédiatement
      },
      error: (error) => {
        console.error('Error loading history:', error);
        alert('Error loading history. Check console for details.');
      },
      complete: () => {
        console.log('✅ History loading complete');
      },
    });
  }


  onSearchChange() {
    this.page = 1;
    this.loadHistory();
    this.cdr.detectChanges();
  }

  goToPage(page: number) {
    this.page = page;
    this.loadHistory();
    this.cdr.detectChanges();
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadHistory();
      this.cdr.detectChanges();
    }
  }

  nextPage() {
    if (this.page < this.pagination.totalPages) {
      this.page++;
      this.loadHistory();
      this.cdr.detectChanges();
    }
  }

  loadStatistics() {
    this.apiService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
      },
    });
  }

  getSuccessRate(): number {
    if (!this.statistics || this.statistics.total === 0) return 0;
    return Math.round((this.statistics.sent / this.statistics.total) * 100);
  }
}
