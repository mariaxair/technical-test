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
  statistics: any = null;
  limit = 100;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadHistory();
    this.loadStatistics();
  }

  loadHistory() {
    console.log('Loading history...');
    this.apiService.getHistory(this.limit).subscribe({
      next: (data) => {
        console.log('History loaded:', data);
        this.history = data;
        this.cdr.detectChanges(); // 🔥 force Angular à mettre à jour la vue immédiatement
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
