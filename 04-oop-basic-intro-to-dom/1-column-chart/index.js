export default class ColumnChart {
  _appendMainStructureToRoot(root) {
    const titleElement = document.createElement("div");
    titleElement.className = "column-chart__title";

    titleElement.insertAdjacentHTML("afterbegin", `${this.label}
      <a class="column-chart__link" href="${this.link}">View all</a>`);

    this.containerElement = document.createElement("div");
    this.containerElement.className = "column-chart__container";

    this.containerElement.insertAdjacentHTML("afterbegin", `
      <div data-element="header" class="column-chart__header">
        ${this._formatNum(this.value)}
      </div>`);

    root.append(titleElement, this.containerElement);
  }

  _initProperties(data, label, value, link, formatHeading) {
    this._data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
  }

  constructor ({ data = [], label = '', value = 0, link = '', formatHeading = data => data} = {}) {
    this._initProperties(data, label, value, link, formatHeading);

    const root = document.createElement("div");
    root.className = "column-chart";
    root.setAttribute("style", `--chart-height: ${this.chartHeight}`);

    this._appendMainStructureToRoot(root);

    this.element = root;

    this.data = data;
  }

  get data() {
    return this._data;
  }

  set data(arr) {
    if (arr.length === 0) {
      this.element.classList.add("column-chart_loading");
    } else {
      this._initNotZeroData();
    }
    this._data = arr;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  update(data) {
    this.data = data;
  }

  _initNotZeroData() {
    const chartBodyElement = this._createChartBodyElement();
    const columnProps = this._getColumns(this._data);
    const chartColumnsHTML = columnProps.reduce((prevHTML, column) => {
      return prevHTML +
        `<div style="--value: ${column.barHeight}" data-tooltip="${column.percent}"></div>`;
    }, "");
    chartBodyElement.insertAdjacentHTML("afterbegin", chartColumnsHTML);

    this.containerElement.append(chartBodyElement);
  }

  _getColumns(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        value: item,
        percent: (item / maxValue * 100).toFixed(0) + '%',
        barHeight: String(Math.floor(item * scale))
      };
    });
  }

  _formatNum(num) {
    const numStr = num.toString();
    let newStr = "";

    for (let i = 0; i < numStr.length; i++) {
      if ((i % 3 === 0) && (i > 0)) {
        newStr = "," + newStr;
      }
      newStr = numStr[numStr.length - 1 - i] + newStr;
    }

    return this.formatHeading(newStr);
  }

  _createChartBodyElement() {
    const elem = document.createElement("div");
    elem.className = "column-chart__chart";
    elem.setAttribute("data-element", "body");

    return elem;
  }
}
