import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TemplateStore {
  templates: any[] = [];

  // tu peux aussi stocker un cache pour d’autres infos :
  lastUpdated: Date | null = null;
}
