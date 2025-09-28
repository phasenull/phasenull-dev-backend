// Types for the DataTable component and related data structures

export interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'url' | 'date' | 'select' | 'boolean' | 'image' | 'file';
  required?: boolean;
  editable?: boolean;
  sortable?: boolean;
  width?: string;
  options?: string[]; // for select type
}

export interface RowData {
  [key: string]: any;
  _isNew?: boolean;
  _isModified?: boolean;
  _isSelected?: boolean;
}

export interface DataTableProps {
  data: RowData[];
  columns: Column[];
  onSave?: (data: RowData[]) => Promise<void>;
  onDelete?: (rows: RowData[]) => Promise<void>;
  primaryKey?: string;
  title?: string;
  maxHeight?: string;
  enableAdd?: boolean;
  enableDelete?: boolean;
  enableEdit?: boolean;
  enableSort?: boolean;
  enableBulkActions?: boolean;
}

// Common entity types for your application
export interface Stack {
  id: number;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Design';
  description?: string;
  active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Project {
  id: number;
  name: string;
  status: 'Planning' | 'In Progress' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  url?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface StackProjectRelation {
  id: number;
  stack_id: number;
  project_id: number;
  usage_type: 'Primary' | 'Secondary' | 'Development' | 'Testing';
  notes?: string;
  created_at: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}