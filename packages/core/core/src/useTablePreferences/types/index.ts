export interface UserTablePreferences {
  /** The number of items to display per page */
  pageSize?: number
  /** The column to sort by's `key` defined in the table headers */
  sortColumnKey?: string
  /** The order by which to sort the column, one of `asc` or `desc` */
  sortColumnOrder?: 'asc' | 'desc'
}
