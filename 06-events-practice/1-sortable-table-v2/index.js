export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true
  } = {}) {
    this.headersConfig = this.prepareHeaderConfig(headersConfig);
    this.data = data;
    this.sortField = sorted.id;
    this.sortOrder = sorted.order;
    this.isSortLocally = isSortLocally;
    this.element = document.createElement('div');
    this.handleHeaderClick = this._handleHeaderClick.bind(this);

    this.sort(this.sortField, this.sortOrder);
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

  _handleHeaderClick(e) {
    let headerCell = this.getHeaderCellOnClick(e.target);

    let prevSortField = this.sortField;
    this.sortField = headerCell.getAttribute("data-id");

    let sortingFieldConfig = this.headersConfig.get(this.sortField);
    if (sortingFieldConfig.sortable) {
      this.sortOrder = prevSortField === this.sortField
        ? this.getNameOfReversedSortingOrder(this.sortOrder) : "desc";
    }

    this.sort(this.sortField, this.sortOrder);
  }

  getHeaderCellOnClick(eventTarget) {
    return eventTarget.closest("[data-id]");
  }

  getNameOfReversedSortingOrder(sortOrder) {
    return (sortOrder === 'asc') ? 'desc' : 'asc';
  }

  createListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderClick);
  }

  render() {
    this.element.innerHTML = this.createTemplate();

    this.subElements = {
      header: this.element.querySelector('div[data-element="header"]'),
      body: this.element.querySelector('div[data-element="body"]'),
    };

    this.createListeners();
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
    if (this.isSortLocally) {
      this.sortOnClient(fieldValue, orderValue);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(fieldValue, orderValue) {
    this.sortField = fieldValue;
    this.sortOrder = orderValue;

    let sortingFieldConfig = this.headersConfig.get(this.sortField);

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

  sortOnServer() {

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
    this.headersConfig.forEach((properties, id) => {
      row +=
        `
        <div
          class="sortable-table__cell"
          data-id="${id}"
          data-sortable="${properties.sortable}"
          data-order=${this.sortField === id ? this.sortOrder : "desc"}
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
    this.headersConfig.forEach((properties, id) => {
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
    this.destroyListeners();
    this.remove();
  }
}
