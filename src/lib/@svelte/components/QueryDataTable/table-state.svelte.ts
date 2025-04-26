import { SvelteSet } from "svelte/reactivity";
import { get, type Writable } from "svelte/store";

export interface TableState<T> {
    data: T[];
    selectedRows: SvelteSet<T[keyof T]>;
    totalRows: number;
    areAllRowsSelected: boolean;
    areSomeRowsSelected: boolean;
    sort: `${'+' | '-'}${string}` | '';
    toggleSort: (column: string, params: Writable<{ sort: string | null }>) => void;
    getSortDirection: (column: string, sort: string | null) => 'asc' | 'desc' | false;
    onToggleAllRowsSelection: () => void,
    onToggleRowSelection: (row: T) => void,
    isRowSelected: (row: T) => boolean
}

export class TableViewModel<T> implements TableState<T> {

    selectedRows = $state<SvelteSet<string>>(new SvelteSet())
    data = $state<T[]>([])
    sort = $state('')

    constructor(data: T[]) {
        this.data = data
    }

    public get totalRows() {
        return this.data.length;
    }

    public get selectedRowCount() {
        return this.selectedRows.size
    }

    areAllRowsSelected = $derived.by(() => {
        return this.selectedRowCount === this.totalRows
    })

    areSomeRowsSelected = $derived.by(() => {
        return this.selectedRowCount > 0 && this.selectedRowCount < this.totalRows
    })

    public isRowSelected(row: T) {
        return this.selectedRows.has(row.id)
    }

    onToggleRowSelection(row: T) {
        if (this.isRowSelected(row)) {
            this.selectedRows.delete(row.id);
        } else {
            this.selectedRows.add(row.id);
        }
        this.selectedRows = this.selectedRows; // Trigger reactivity
    };

    onToggleAllRowsSelection() {
        if (this.selectedRowCount < this.data.length) {
            this.selectedRows = new SvelteSet(this.data.map(({ id }) => id));
        } else {
            this.selectedRows = new SvelteSet()
        }
    }

    toggleSort(column: string, params: Writable<{ sort: string | null }>) {

        const currentSort = get(params).sort;
        if (currentSort?.startsWith('-') && currentSort.slice(1) === column) {
            params.update((value) => ({ ...value, sort: null }));
        } else if (currentSort?.slice(1) === column) {
            params.update((value) => ({ ...value, sort: `-${column}` }));
        } else {
            params.update((value) => ({ ...value, sort: `+${column}` }));
        }

    };

    getSortDirection(columnId: string, sort: string | null): 'asc' | 'desc' | false {
        if (!sort) return false;
        if (sort === `+${columnId}`) return 'asc';
        if (sort === `-${columnId}`) return 'desc';
        return false;
    }

}