export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getTableHeaderCellsHTML()}
          </div>
        </div>
      </div>
    `;
  }

  getTableHeaderCellsHTML() {
    return this.headerConfig.map(columnData => {
      return `
        <div
          class="sortable-table__cell"
          data-id="${columnData.id}"
          data-sortable="${columnData.sortable}"
          data-order="${this.sortType}"
        >
          <span>${columnData.title}</span>
          ${this.sortField === columnData.id ? this.getArrowHTML : ""}
        </div>
      `;
    });
  }

  getArrowHTML() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }
}

