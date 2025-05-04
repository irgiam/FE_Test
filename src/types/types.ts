export interface Gerbang {
  id: number;
  IdCabang: number;
  NamaGerbang: string;
  NamaCabang: string;
}

export interface ApiResponse {
  status: boolean;
  message: string;
  code: number;
  data: {
    total_pages: number;
    current_page: number;
    count: number;
    rows: {
      count: number;
      rows: Gerbang[];
    };
  };
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalData: number;
  pageSize: number;
}