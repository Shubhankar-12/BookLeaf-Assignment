export interface ListAdminTicketsRequest {
  page?: string;
  limit?: string;
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  search?: string;
}
