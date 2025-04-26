import { DatabaseTable, PostgresDataType } from "@/shared/pages/static/database-management/types/table";
import DataTable, { Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showToast } from "@/shared/utils/toast";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface TablePreviewProps {
  table: DatabaseTable;
  databaseName: string;
}

interface TableRow {
  id: number | string;
  [key: string]: any;
}

export const TablePreview = ({ table, databaseName }: TablePreviewProps) => {
  const [previewData, setPreviewData] = useState<TableRow[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreviewData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/database/${databaseName}/tables/${table.table_name}/preview`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const data = await response.json();
        setPreviewData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching preview data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        setPreviewData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreviewData();
  }, [table.table_name, databaseName]);

  const handleEdit = (row: TableRow) => {
    setSelectedRow(row);
    setEditFormData(row);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!selectedRow) return;
    
    try {
      const response = await fetch(
        `/api/database/${databaseName}/tables/${table.table_name}/rows/${selectedRow.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to update row');
      }

      // Refresh the data
      const updatedData = previewData.map((row) =>
        row.id === selectedRow.id ? { ...row, ...editFormData } : row
      );
      setPreviewData(updatedData);
      setIsEditDialogOpen(false);
      showToast.success("Row updated successfully");
    } catch (error) {
      console.error('Error updating row:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to update row');
    }
  };

  const handleDelete = async (row: TableRow) => {
    if (!confirm('Are you sure you want to delete this row?')) {
      return;
    }

    try {
      const response = await fetch(
        `/api/database/${databaseName}/tables/${table.table_name}/rows/${row.id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to delete row');
      }

      // Remove the row from the local state
      setPreviewData(previewData.filter((item) => item.id !== row.id));
      showToast.success("Row deleted successfully");
    } catch (error) {
      console.error('Error deleting row:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to delete row');
    }
  };

  const columns: Column<TableRow>[] = table.columns.map(col => ({
    key: col.name,
    header: col.name,
    render: (value) => {
      if (col.type === 'boolean') return value ? 'Yes' : 'No';
      if (col.type === 'timestamp' || col.type === 'timestamp with time zone') {
        return value ? new Date(value).toLocaleString() : '';
      }
      if (col.type === 'date') {
        return value ? new Date(value).toLocaleDateString() : '';
      }
      return String(value ?? '');
    }
  }));

  return (
    <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center mx-auto h-full">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <DataTable
            onEdit={handleEdit}
            onDelete={handleDelete}
            data={previewData}
            columns={columns}
          />
        )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Row</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {table.columns.map((col) => (
              <div key={col.name} className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">{col.name}</label>
                {isNumericType(col.type) ? (
                  <Input
                    type="number"
                    value={editFormData[col.name] || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, [col.name]: e.target.value })
                    }
                    className="col-span-3"
                  />
                ) : (
                  <Input
                    value={editFormData[col.name] || ''}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, [col.name]: e.target.value })
                    }
                    className="col-span-3"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
  );
};

function isNumericType(type: PostgresDataType): boolean {
  return [
    'integer',
    'bigint',
    'smallint',
    'numeric',
    'real',
    'double precision'
  ].includes(type);
}