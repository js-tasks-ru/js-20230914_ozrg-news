export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = new Map();
    for (const headerColumn of headerConfig) {
      this.headerConfig.set(headerColumn.id, {
        title: headerColumn.title,
        sortable: headerColumn.sortable,
        template: headerColumn.template,
        sortType: headerColumn.sortType,
      });
    }

    this.data = data;
    this.sortField = "";
    this.sortOrder = "";
    this.element = document.createElement('div');

    this.render();
  }

  render() {
    this.element.innerHTML = `
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.createTableHeaderCellsHTML()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.createTableRowsHTML()}
          </div>
        </div>
      </div>
    `;

    this.element = this.element.firstElementChild;
    this.subElements = {
      header: this.element.querySelector('div[data-element="header"]'),
      body: this.element.querySelector('div[data-element="body"]'),
    };
  }

  sort(fieldValue, orderValue) {
    this.sortField = fieldValue;
    this.sortOrder = orderValue;

    let sortingFieldConfig = this.headerConfig.get(this.sortField);
    if (sortingFieldConfig.sortable) {
      let sortType = sortingFieldConfig.sortType;

      if (this.sortOrder === 'asc') {
        if (sortType === "string") {
          this.data.sort((a, b) => this.compareStringsAsc(a[this.sortField], b[this.sortField]));
        } else {
          this.data.sort((a, b) => a[this.sortField] - b[this.sortField]);
        }
      } else if (this.sortOrder === 'desc') {
        if (sortType === "string") {
          this.data.sort((a, b) => this.compareStringsDesc(a[this.sortField], b[this.sortField]));
        } else {
          this.data.sort((a, b) => b[this.sortField] - a[this.sortField]);
        }
      }
      this.render();
    }
  }

  compareStringsAsc(a, b) {
    return a.localeCompare(b, ["ru", "en"], {caseFirst: "upper"});
  }

  compareStringsDesc(a, b) {
    return b.localeCompare(a, ["ru", "en"], {caseFirst: "upper"});
  }

  createTableHeaderCellsHTML() {
    let row = "";
    this.headerConfig.forEach((properties, id) => {
      row +=
        `
        <div
          class="sortable-table__cell"
          data-id="${id}"
          data-sortable="${properties.sortable}"
          ${this.sortType ? 'data-order="' + this.sortType + '"' : ""}
        >
          <span>${properties.title}</span>
          ${this.sortField === id ? this.createArrowHTML() : ""}
        </div>
        `;
    });
    return row;
  }

  createArrowHTML() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }

  createTableRowsHTML() {
    return this.data.map(rowContent => `
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        ${this.createTableRowHTML(rowContent)}
      </a>
    `).join('');
  }

  createTableRowHTML(rowContent) {
    let row = "";
    this.headerConfig.forEach((properties, id) => {
      let cellData = rowContent[id];
      row += properties.template
        ? properties.template(cellData)
        :
        `
          <div class="sortable-table__cell">${cellData}</div>
        `;
    });
    return row;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

