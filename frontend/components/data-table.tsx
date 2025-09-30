"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Check, X, Eye } from "lucide-react"

interface Column {
  key: string
  label: string
  sortable?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  actions?: {
    approve?: (id: string) => void
    reject?: (id: string) => void
    view?: (id: string) => void
    edit?: (id: string) => void
    delete?: (id: string) => void
  }
  searchable?: boolean
  filterable?: boolean
  filterOptions?: { value: string; label: string }[]
}

export function DataTable({
  columns,
  data,
  actions,
  searchable = true,
  filterable = false,
  filterOptions = [],
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("all")

  const filteredData = data.filter((item) => {
    const matchesSearch = searchable
      ? Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
      : true

    const matchesFilter =
      filterable && filterValue !== "all" ? item.status === filterValue || item.severity === filterValue : true

    return matchesSearch && matchesFilter
  })

  const renderCellValue = (item: any, key: string) => {
    const value = item[key]

    // Handle status badges
    if (key === "status") {
      const statusColors = {
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      }
      return (
        <Badge className={statusColors[value as keyof typeof statusColors]} variant="secondary">
          {value}
        </Badge>
      )
    }

    // Handle severity badges
    if (key === "severity") {
      const severityColors = {
        low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      }
      return (
        <Badge className={severityColors[value as keyof typeof severityColors]} variant="secondary">
          {value}
        </Badge>
      )
    }

    // Handle dates
    if (key.includes("Date") || key.includes("At")) {
      return new Date(value).toLocaleDateString()
    }

    return String(value)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {(searchable || filterable) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {searchable && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}

          {filterable && filterOptions.length > 0 && (
            <Select value={filterValue} onValueChange={setFilterValue}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {actions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>{renderCellValue(item, column.key)}</TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.view && (
                          <Button variant="ghost" size="sm" onClick={() => actions.view!(item.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.approve && item.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.approve!(item.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {actions.reject && item.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => actions.reject!(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
