import { Routes } from '@angular/router';
import { DossierNewComponent } from './components/dossier-new/dossier-new.component';
import { DossierDetailComponent } from './components/dossier-detail/dossier-detail.component';
import { DossiersComponent } from './components/dossiers.component';

export const DossiersRoutes: Routes = [
  { path: 'new', component: DossierNewComponent },
  { path: ':slug', component: DossierDetailComponent },
  { path: '', component: DossiersComponent }
];
