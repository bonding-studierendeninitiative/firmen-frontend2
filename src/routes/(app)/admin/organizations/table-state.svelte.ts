interface TableState<T> {
    data: T[];
    selectedRows: Set<T>;
    totalRows: number;
    isLoading: boolean;
    areAllRowsSelected: boolean;
    onToggleAllRowsSelection: () => void,
    onToggleRowSelection: (row: T) => void,
}

export class TableViewModel<T> implements TableState<T> {
    
    selectedRows = $state<Set<T>>(new Set());
    isLoading = $state(false)
    data = $state<T[]>([]);

    public get totalRows() {
        return this.data.length;
    }

    public get areAllRowsSelected() {
        return this.selectedRows.size === this.totalRows
    }
    
    onToggleRowSelection(row: T) {
        if (this.selectedRows.has(row)) {
			this.selectedRows.delete(row);
		} else {
			this.selectedRows.add(row);
		}
		this.selectedRows = this.selectedRows; // Trigger reactivity
    };
    
    onToggleAllRowsSelection() {
        this.selectedRows = new Set(this.data);
    }

    setLoading() {
        this.isLoading = true
    }

    setLoaded(data: T[]) {
        this.isLoading = false
        this.data = data
    }

}