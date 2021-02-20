export class AjaxRequest<T> {
  total: number;
  limit: number;
  page: number;
  pages: number;
  docs: T | [] ;

  constructor() {
    this.total = 0;
    this.limit = 0;
    this.page = 0;
    this.pages = 0;
    this.docs = [];
  }
}