import { getTableColumns, sql, type SQL } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'
import { nanoid } from 'nanoid'

export function randomId() {
    return nanoid()
}

export function prefixId(prefix: string) {
    return `${prefix}_${randomId()}`
}

export function buildConflictUpdateColumns<
    T extends PgTable,
    Q extends keyof T['_']['columns'],
>(table: T, columns: Q[]) {
    const cls = getTableColumns(table)
    return columns.reduce(
        (acc, column) => {
            const colName = cls[column].name
            acc[column] = sql.raw(`excluded."${colName}"`)
            return acc
        },
        {} as Record<Q, SQL>,
    )
}
