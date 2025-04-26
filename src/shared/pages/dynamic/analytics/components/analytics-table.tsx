import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DetailsDataItem } from "../types"

interface AnalyticsTableProps {
  data: DetailsDataItem[]
}

export function AnalyticsTable({ data }: AnalyticsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Change</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end">
                  <ChangeIndicator change={item.change} />
                </div>
              </TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface ChangeIndicatorProps {
  change: number
}

function ChangeIndicator({ change }: ChangeIndicatorProps) {
  const isPositive = change > 0
  const isNeutral = change === 0

  return (
    <div
      className={cn(
        "flex items-center text-xs font-medium",
        isPositive ? "text-green-600" : isNeutral ? "text-gray-500" : "text-red-600",
      )}
    >
      {isPositive ? (
        <ArrowUp className="mr-1 h-3 w-3" />
      ) : isNeutral ? (
        <Minus className="mr-1 h-3 w-3" />
      ) : (
        <ArrowDown className="mr-1 h-3 w-3" />
      )}
      <span>{Math.abs(change).toFixed(1)}%</span>
    </div>
  )
}
