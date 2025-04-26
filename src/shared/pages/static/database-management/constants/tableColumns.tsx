import React from 'react';
import { DatabaseTable } from "../types";

export type Column<T> = {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

// Interfaces for each entity
export interface Client {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export interface Employee {
  name: string;
  position: string;
  department: string;
  email: string;
}

export interface Course {
  title: string;
  instructor: string;
  duration: string;
  level: string;
}

export interface Project {
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  manager: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: string;
  type: string;
  status: string;
}

// Helper function to create columns
function createColumns<T>(config: { key: keyof T; header: string }[]): Column<T>[] {
  return config.map(({ key, header }) => ({ key, header }));
}

export const clientColumns: Column<Client>[] = createColumns<Client>([
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "company", header: "Company" },
  { key: "phone", header: "Phone" }
]);

export const employeeColumns: Column<Employee>[] = createColumns<Employee>([
  { key: "name", header: "Name" },
  { key: "position", header: "Position" },
  { key: "department", header: "Department" },
  { key: "email", header: "Email" }
]);

export const courseColumns: Column<Course>[] = createColumns<Course>([
  { key: "title", header: "Title" },
  { key: "instructor", header: "Instructor" },
  { key: "duration", header: "Duration" },
  { key: "level", header: "Level" }
]);

export const projectColumns: Column<Project>[] = createColumns<Project>([
  { key: "name", header: "Name" },
  { key: "status", header: "Status" },
  { key: "startDate", header: "Start Date" },
  { key: "endDate", header: "End Date" },
  { key: "manager", header: "Project Manager" }
]);

export const transactionColumns: Column<Transaction>[] = createColumns<Transaction>([
  { key: "id", header: "ID" },
  { key: "date", header: "Date" },
  { key: "amount", header: "Amount" },
  { key: "type", header: "Type" },
  { key: "status", header: "Status" }
]);

export const databaseTableColumns: Column<DatabaseTable>[] = [
  {
    key: "id",
    header: "ID",
  },
  {
    key: "name",
    header: "Table Name",
  },
  {
    key: "feature",
    header: "Feature",
    render: (value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return "N/A";
      // Now value is the expected feature object
      return (
        <span className="text-sm text-muted-foreground">
          {value.name || "N/A"} ({value.entityType || "N/A"})
        </span>
      );
    },
  },
];