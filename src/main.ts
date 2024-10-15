import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

interface FileReaderSync {
  readAsArrayBuffer(blob: Blob): any;
  readAsBinaryString(blob: Blob): void;
  readAsDataURL(blob: Blob): string;
  readAsText(blob: Blob, encoding?: string): string;
}

declare var FileReaderSync: {
  prototype: FileReaderSync;
  new(): FileReaderSync;
};
