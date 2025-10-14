import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './templates/template.component';
import { RecipientComponent } from './recipients/recipient.component';
import { SendEmailComponent } from './send-email/send-email.component';
import { HistoryComponent } from './history/history.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TemplateComponent,
    RecipientComponent,
    SendEmailComponent,
    HistoryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currentView = 'templates';

  setView(view: string) {
    this.currentView = view;
  }
}
