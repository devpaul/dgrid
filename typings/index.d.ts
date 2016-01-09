/// <reference path="./dojo/1.10/dojo" />

declare namespace dgrid {
    import ExtensionEvent = dojo.ExtensionEvent;
    import EventListener = dojo.EventListener;
    import Handle = dojo.Handle;
    import Point = dojo.Point;

    interface GenericObject {
        [key: string]: any;
    }

    interface CssRule {
        get(prop: string): string;
        set(prop: string, value: string);
        remove(): void;
    }

    interface RowElement extends HTMLElement { // created by List#renderRow()
        rowIndex: number;
        className: string;
    }

    interface Row {
        id: number;
        data: GenericObject;
        element: HTMLElement;
        remove(): void;
    }

    type RowIdentifier = Row | Event | HTMLElement | GenericObject | number;
    type CellIdentifier = Event | HTMLElement | GenericObject | number;

    interface CellElement extends HTMLElement { }

    interface Cell {
        row: Row;
        column?: GenericObject;
        element?: HTMLElement;
    }

    interface List {
        new (options: GenericObject);

        domNode: HTMLElement;

        tabableHeader: boolean;

        // Whether to render header (sub)rows.
        showHeader: boolean;

        // Whether to render footer area.  Extensions which display content
        // in the footer area should set this to true.
        showFooter: boolean;

        // Whether to maintain the odd/even classes when new rows are inserted.
        // This can be disabled to improve insertion performance if odd/even styling is not employed.
        maintainOddEven: boolean;

        // Whether to track rules added via the addCssRule method to be removed
        // when the list is destroyed.  Note this is effective at the time of
        // the call to addCssRule, not at the time of destruction.
        cleanAddedRules: boolean;

        // If touch support is available, this determines whether to
        // incorporate logic from the TouchScroll module (at the expense of
        // normal desktop/mouse or native mobile scrolling functionality).
        useTouchScroll: boolean;

        // Whether to add jQuery UI classes to various elements in dgrid's DOM.
        addUiClasses: boolean;

        // Whether to clean up observers for empty result sets.
        cleanEmptyObservers: boolean;

        // The amount of time (in milliseconds) that a row should remain
        // highlighted after it has been updated.
        highlightDuration: number;

        listType: string;

        // perform setup and invoke create in postScript to allow descendants to
        // perform logic before create/postCreate happen (a la dijit/_WidgetBase)
        postScript(params: GenericObject, srcNodeRef: Node): void;
        buildRendering(): void;
        postCreate(): void;
        startup(): void;
        destroy(): void;

        create(params: GenericObject, srcNodeRef: Node): void;

        configStructure(): void;
        resize(): void;
        addCssRule(selector: string, css: string): CssRule;
        on(eventType: string | ExtensionEvent, listener: EventListener): Handle;
        cleanup(): void;
        refresh(): void;
        newRow(object: GenericObject, parentNode: HTMLElement, beforeNode: Node, i: number, options: GenericObject): RowElement;
        adjustRowIndices(firstRow: RowElement): void;

        // This renders an array or collection of objects as rows in the grid, before the
        // given node. This will listen for changes in the collection if an observe method
        // is available (as it should be if it comes from an Observable data store).
        renderArray(results: RowElement[] | any, beforeNode?: HTMLElement, options?: GenericObject): RowElement[];

        // Creates a single row in the grid.
        insertRow(object: any, parent: Node, beforeNode: Node, i: number, options: GenericObject): RowElement;

        renderRow(value: any, options: GenericObject): HTMLElement;

        // Simply deletes the node in a plain List.
        // Column plugins may aspect this to implement their own cleanup routines.
        removeRow(rowElement: RowElement, justCleanup?: boolean): void;

        // Get the row object by id, object, node, or event
        row(target: RowIdentifier): Row;

        // TODO columnId was added to satify OnDemandGrid's extension
        cell(target: CellIdentifier, columnId?: string): Cell;

        // Returns the row that is the given number of steps (1 by default)
        // above the row represented by the given object.
        up(row: RowIdentifier, steps: number, visible?: boolean): Row;

        // Returns the row that is the given number of steps (1 by default)
        // below the row represented by the given object.
        down(row: RowIdentifier, steps: number, visible?: boolean): Row;

        scrollTo(options: GenericObject): any;

        getScrollPosition(): Point;

        get(name: string, ... args: any[]): any;

        set(name: string, value: GenericObject, ... args: any[]): this;
    }

    interface OnDemandList extends List, _StoreMixin {

    }

    interface Grid extends List {
        columns: GenericObject;
        cellNavigation: boolean;
        tabableHeader: boolean;
        showHeader: boolean;
        listType: string;
        column(target: {} | number): Object;
        cell(target: CellIdentifier, columnId?: string): Cell;
        createRowCells(tag: string, each: Function, subRows: RowElement[], object?: string): RowElement;
        left(cell: CellElement, steps?: number): CellElement;
        right(cell: CellElement, steps?: number): CellElement;
        renderHeader(): void;
        resize(): void;
        updateSortArrow(sort: GenericObject[], updateSort?: boolean): void;
        styleColumn(colId: string, css: string): CssRule;
        configStructure(): void;
    }

    interface OnDemandGrid extends Grid, OnDemandList {

    }

    interface ColumnSet {
        // TODO fully define this interface
    }

    interface _StoreMixin {
        store: GenericObject;
        query: GenericObject;
        queryOptions: GenericObject;
        getBeforePut: boolean;
        noDateMessage: string;
        loadingMessage: string;

        postCreate(): void;
        destroy(): void;

        // Creates a single row in the grid.
        insertRow(object: any, parent: Node, beforeNode: Node, i: number, options: GenericObject): RowElement;

        updateDirty(id: number, field: string | number, value: any): void;

        save(): void;
        revert(): void;
        newRow(object: GenericObject, parentNode: HTMLElement, beforeNode: Node, i: number, options: GenericObject): RowElement;
        removeRow(rowElement: RowElement, justCleanup?: boolean): void;
    }
}
