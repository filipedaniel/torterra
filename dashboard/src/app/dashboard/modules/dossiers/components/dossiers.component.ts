import { Component, OnInit } from '@angular/core';
import { Dossier } from 'src/app/shared/classes/Dossier';
import { DossiersService } from 'src/app/services/dossiers.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dossiers',
  templateUrl: './dossiers.component.html'
})
export class DossiersComponent implements OnInit {
  isLoading = true;
  searchQuery = '';

 // list of dossiers
 dossiers: Dossier[];

 // pagination options
 totalDocs: number;
 docsLimit: number;
 actualPage: number;
 totalPages: number;
 // ****

 searchInput = '';

 constructor(
   private dossierService: DossiersService,
   private toastr: ToastrService) { }

 ngOnInit() {
   this.getDossiers();
 }

  getDossiers(query = '') {
    return this.dossierService.getDossiers(query)
      .subscribe(
        data => {
          this.totalDocs = data.total;
          this.docsLimit = data.limit;
          this.actualPage = data.page;
          this.totalPages = data.total;
          this.dossiers = data.docs;
          this.isLoading = false;
        },
        error => {
          this.toastr.error(error.message ? error.message : 'Error!');
          this.isLoading = false;
        });
  }

  deleteDossier(event) {
    this.getDossiers();
  }

  search(event): void {
    if (event.target.value === '') {
      this.isLoading = true;
      this.searchInput = '';
      this.getDossiers();
    } else {
      if (event.keyCode == 13) {
        this.isLoading = true;
        // this.pageState = 1;
        this.searchInput = `?search=${event.target.value}`;
        this.getDossiers(this.searchInput);
      }
    }
  }

  pageChanged(event): void {
    this.isLoading = true;
    const pageQuery = `limit=${this.docsLimit}&page=${event.page}`;
    const getQuery = this.searchInput === '' ? `?${pageQuery}` : `${this.searchInput}&${pageQuery}`;

    this.getDossiers(getQuery);
    window.scrollTo(0, 0);
  }

}
