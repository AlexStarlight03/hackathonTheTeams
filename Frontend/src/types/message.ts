
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface Message {
  id: number;
  message: string;
  time: string;
  emmeteurId: number;
  emmeteur: User;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: Pagination;
}
