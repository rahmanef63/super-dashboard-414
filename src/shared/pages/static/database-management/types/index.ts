import { Dashboard } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  dashboards?: Dashboard[];
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  id: string;
  name: string;
  description?: string;
  tables: DatabaseTable[];
  features: DatabaseFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTable {
  id: string;
  name: string;
  columns: DatabaseColumn[];
  feature?: {
    name: string;
    entityType: 'design' | 'project' | 'financial' | 'hr';
  };
}

export interface DatabaseColumn {
  name: string;
  type: string;
  required: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface DatabaseFeature {
  name: string;
  enabled: boolean;
  syncInterval?: number;
}

export interface DatabaseMapping {
  featureId: string;
  databaseId: string;
  tableId: string;
  mappedFields: {
    sourceField: string;
    targetField: string;
  }[];
}

export interface DatabaseFormData {
  name: string;
  description: string;
}

export interface DatabaseOperations {
  onAddTable: (table: DatabaseTable) => void;
  onUpdateTable: (table: DatabaseTable) => void;
  onDeleteTable: (tableId: string) => void;
}

export interface DatabaseContentProps extends DatabaseOperations {
  database: Database;
  onEditClick: (db: Database) => void;
  onDeleteClick: (db: Database) => void;
  availableTables: string[];
}

export interface DatabaseTableFormProps {
  onSave: (table: DatabaseTable) => void;
  availableTables: string[];
  initialTable?: DatabaseTable;
}

export interface DatabaseTablesProps extends DatabaseOperations {
  tables: DatabaseTable[];
  availableTables: string[];
}


export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  category: string;
  enrolledEmployees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseFeatureConfig {
  enabled: boolean;
  mapping: DatabaseMapping | null;
  syncInterval: number;
}

