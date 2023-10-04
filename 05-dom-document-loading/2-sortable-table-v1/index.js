export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = this.prepareHeaderConfig(headerConfig);
    this.data = data;
    this.sortField = "";
    this.sortOrder = "";
    this.element = document.createElement('div');

    this.render();
  }

  prepareHeaderConfig(headerConfig) {
    let configeredHeader = new Map();
    for (const headerColumn of headerConfig) {
      configeredHeader.set(headerColumn.id, {
        title: headerColumn.title,
        sortable: headerColumn.sortable,
        template: headerColumn.template,
        sortType: headerColumn.sortType,
      });
    }

    return configeredHeader;
  }

  render() {
    this.element.innerHTML = this.createTemplate();

    this.element = this.element.firstElementChild;
    this.subElements = this.element.querySelectorAll('div[data-element]');
    this.subElements = {
      header: this.subElements[0],
      body: this.subElements[1],
    };
  }

  createTemplate() {
    return `
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
  }

  sort(fieldValue, orderValue) {
    this.sortField = fieldValue;
    this.sortOrder = orderValue;

    let sortingFieldConfig = this.headerConfig.get(this.sortField);

    if (sortingFieldConfig.sortable) {
      let sortType = sortingFieldConfig.sortType;
      let comparisonFunction = this.getComparisonFunction(
        this.sortField,
        sortType,
        this.sortOrder
      );
      this.data.sort(comparisonFunction);
      this.render();
    }
  }

  getComparisonFunction(sortField, sortType, sortOrder) {
    if (sortOrder === 'asc') {
      if (sortType === "string") {
        return (a, b) => this.compareStringsAsc(a[sortField], b[sortField]);
      } else {
        return (a, b) => a[sortField] - b[sortField];
      }
    } else if (sortOrder === 'desc') {
      if (sortType === "string") {
        return (a, b) => this.compareStringsDesc(a[sortField], b[sortField]);
      } else {
        return (a, b) => b[sortField] - a[sortField];
      }
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

