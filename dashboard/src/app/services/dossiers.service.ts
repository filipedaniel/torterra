import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AjaxRequest } from '../shared/classes/AjaxRequest';
import { Dossier } from '../shared/classes/Dossier';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DossiersService {

  private baseUrl = environment.apiBaseUrl + '/dossier';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  // Get all dossiers
  getDossiers(query: string = ''): Observable<AjaxRequest<Dossier[]>> {
    return this.http.get<AjaxRequest<Dossier[]>>(this.baseUrl + query);
  }

  getDossierBySlug(slug: string, query: string = ''): Observable<Dossier> {
    const url = this.baseUrl + '/slug/' + slug + query;
    return this.http.get<Dossier>(url);
  }

  // Delete dossier by id
  deleteDossier(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url, this.httpOptions);
  }

  // Post new dossier
  addDossier(dossier: Dossier): Observable<Dossier> {
    return this.http.post<Dossier>(this.baseUrl, dossier, this.httpOptions);
  }

  updateDossier(dossierId: string, dossier: Dossier): Observable<Dossier> {
    return this.http.patch<Dossier>(this.baseUrl + '/' + dossierId, dossier, this.httpOptions);
  }


  // private handleError(error) {
  //   return throwError(error.error ? error.error : error);
  // }
}
