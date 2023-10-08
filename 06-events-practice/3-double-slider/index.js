export default class DoubleSlider {
  static defaultParams = {
    min: 100,
    max: 200,
    formatValue: value => value,
  };

  constructor (params = DoubleSlider.defaultParams) {
    this.initializeParams(params);
    this.element = document.createElement("div");
    this.element.className = "range-slider";

    this.render();
    this.createListeners();
  }

  initializeParams(params) {
    this.minValue = params?.min ?? DoubleSlider.defaultParams.min;
    this.maxValue = params?.max ?? DoubleSlider.defaultParams.max;
    this.formatValue = params?.formatValue ?? DoubleSlider.defaultParams.formatValue;
    this.selected = params?.selected ?? {from: this.minValue, to: this.maxValue};
    this.windowSize = document.documentElement.getBoundingClientRect().width;
    this.min = this.formatValue(this.minValue);
    this.max = this.formatValue(this.maxValue);
  }

  render() {
    this.element.innerHTML = this.createTemplate(".range-slider");

    this.subElements = this.element.querySelector(".range-slider__inner").children;
    this.subElements = {
      progress: this.subElements[0],
      from: this.subElements[1],
      to: this.subElements[2]
    };

    this.createListeners();
  }

  createTemplate() {
    return `
      <span data-element="from">${this.formatValue(this.selected.from)}</span>
      <div class="range-slider__inner">
        <span
          style="${this.getProgressStyleValue()}"
          class="range-slider__progress"
          data-element="progress">
        </span>
        <span
          style="${this.getThumbLeftStyleValue()}"
          class="range-slider__thumb-left"
        >
        </span>
        <span
          style="${this.getThumbRightStyleValue()}"
          class="range-slider__thumb-right"
        >
        </span>
      </div>
      <span data-element="to">${this.formatValue(this.selected.to)}</span>
    `;
  }

  createRangeSelectEvent(detail) {
    return new CustomEvent("range-select", { detail });
  }

  createListeners() {
    this.resetDefaultDragStartEvent();
    this.subElements.from.onpointerdown = () => this.handleLeftThumbPointerdown();
    this.subElements.to.onpointerdown = () => this.handleRightThumbPointerdown();
  }

  resetDefaultDragStartEvent() {
    this.subElements.from.ondragstart = () => false;
    this.subElements.to.ondragstart = () => false;
  }

  handleLeftThumbPointerdown() {
    let onPointerMove = _onPointerMove.bind(this);

    function _onPointerMove(event) {
      this.moveAt(
        event.clientX,
        "left",
        {
          left: 60,
          right: this.windowSize - 60,
        }
      );
    }

    document.addEventListener("pointermove", onPointerMove);

    document.onpointerup = function () {
      document.removeEventListener("pointermove", onPointerMove);
      document.onpointerup = null;
    };
  }

  handleRightThumbPointerdown() {
    let onPointerMove = _onPointerMove.bind(this);

    function _onPointerMove(event) {
      this.moveAt(
        event.clientX,
        "right",
        {
          left: 60,
          right: this.windowSize - 60,
        }
      );
    }

    document.addEventListener("pointermove", onPointerMove);

    document.onpointerup = function () {
      document.removeEventListener("pointermove", onPointerMove);
      document.onpointerup = null;
    };
  }

  moveAt(pageX, elementType, rangeX) {
    if (pageX < rangeX.left) {
      pageX = rangeX.left;
    } else if (pageX > rangeX.right) {
      pageX = rangeX.right;
    }

    if (elementType === "left") {
      this.moveLeftThumb(pageX);
    } else if (elementType === "right") {
      this.moveRightThumb(pageX);
    }

    this.element.dispatchEvent(this.createRangeSelectEvent({
      from: this.selected.from,
      to: this.selected.to
    }));

    this.render();
  }

  moveLeftThumb(pageX) {
    this.selected.from = this.calculateNewRangeValue(pageX);
  }

  moveRightThumb(pageX) {
    this.selected.to = this.calculateNewRangeValue(pageX);
  }

  calculateNewRangeValue(pageX) {
    return (this.minValue + (pageX - 60) / (this.windowSize - 120) * (this.maxValue - this.minValue)).toFixed(0);
  }

  getProgressStyleValue() {
    return `
      ${this.getThumbLeftStyleValue()}
      ${this.getThumbRightStyleValue()}
    `;
  }

  getThumbLeftStyleValue() {
    return `left: ${((this.selected.from - this.minValue) / (this.maxValue - this.minValue) * 100).toFixed(0)}%;`;
  }

  getThumbRightStyleValue() {
    return `right: ${100 - ((this.selected.to - this.minValue) / (this.maxValue - this.minValue) * 100).toFixed(0)}%;`;
  }

  removeListeners() {
    this.subElements.from.onpointerdown = null;
    this.subElements.to.onpointerdown = null;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }
}
