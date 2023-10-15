export default class DoubleSlider {
  static defaultParams = {
    min: 100,
    max: 200,
    formatValue: value => value,
  };

  constructor (params = DoubleSlider.defaultParams) {
    this.initializeParams(params);
    this.prepareFunctions();

    this.createElement();
    this.selectSubElements();
    this.createListeners();
  }

  initializeParams(params) {
    this.minValue = params?.min ?? DoubleSlider.defaultParams.min;
    this.maxValue = params?.max ?? DoubleSlider.defaultParams.max;
    this.formatValue = params?.formatValue ?? DoubleSlider.defaultParams.formatValue;
    this.selected = params?.selected ?? {from: this.minValue, to: this.maxValue};
    this.min = this.formatValue(this.minValue);
    this.max = this.formatValue(this.maxValue);
    this.selectedThumb = null;
  }

  prepareFunctions() {
    this.handleLeftThumbPointerMove = this._handleLeftThumbPointerMove.bind(this);
    this.handleRightThumbPointerMove = this._handleRightThumbPointerMove.bind(this);
    this.handleThumbPointerdown = this._handleThumbPointerdown.bind(this);
  }

  handleThumbMove() {
    this.subElements.fromValue.textContent = this.formatValue(this.selected.from);
    this.subElements.leftThumb.style.left = this.getThumbLeftStyleValue();

    this.subElements.toValue.textContent = this.formatValue(this.selected.to);
    this.subElements.rightThumb.style.right = this.getThumbRightStyleValue();

    this.subElements.progress.style.left = this.subElements.leftThumb.style.left;
    this.subElements.progress.style.right = this.subElements.rightThumb.style.right;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.className = "range-slider";
    this.element.innerHTML = this.createTemplate(".range-slider");
  }

  selectSubElements() {
    this.subElements = this.element.querySelector(".range-slider__inner").children;
    this.subElements = {
      fromValue: this.element.children[0],
      inner: this.element.children[1],
      toValue: this.element.children[2],
      progress: this.subElements[0],
      leftThumb: this.subElements[1],
      rightThumb: this.subElements[2]
    };
  }

  createTemplate() {
    return `
      <span data-element="from">${this.formatValue(this.selected.from)}</span>
      <div class="range-slider__inner">
        <span
          style="left: ${this.getThumbLeftStyleValue()}; right: ${this.getThumbRightStyleValue()}"
          class="range-slider__progress"
          data-element="progress">
        </span>
        <span
          style="left: ${this.getThumbLeftStyleValue()}"
          class="range-slider__thumb-left"
        >
        </span>
        <span
          style="right: ${this.getThumbRightStyleValue()}"
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
    this.subElements.leftThumb.addEventListener("pointerdown", this.handleThumbPointerdown);
    this.subElements.rightThumb.addEventListener("pointerdown", this.handleThumbPointerdown);
  }

  resetDefaultDragStartEvent() {
    this.subElements.leftThumb.addEventListener("dragstart", this.handleDragStartEvent);
    this.subElements.rightThumb.addEventListener("dragstart", this.handleDragStartEvent);
  }

  handleDragStartEvent() {
    return false;
  }

  _handleThumbPointerdown(e) {
    let onPointerMove;
    if (e.target.classList.contains("range-slider__thumb-left")) {
      this.selectedThumb = "left";
      document.removeEventListener("pointermove", this.handleRightThumbPointerMove);
      onPointerMove = this.handleLeftThumbPointerMove;
    } else {
      this.selectedThumb = "right";
      onPointerMove = this.handleRightThumbPointerMove;
      document.removeEventListener("pointermove", this.handleLeftThumbPointerMove);
    }

    this.sliderClientRect = this.subElements.inner.getBoundingClientRect();

    document.addEventListener("pointermove", onPointerMove);

    document.addEventListener("pointerup", () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.onpointerup = null;
    });
  }

  _handleLeftThumbPointerMove(event) {
    this.moveAt(
      event.clientX,
      "left",
      {
        left: this.sliderClientRect.left,
        right: this.subElements.rightThumb.getBoundingClientRect().x,
      }
    );
  }

  _handleRightThumbPointerMove(event) {
    this.moveAt(
      event.clientX,
      "right",
      {
        left: this.subElements.leftThumb.getBoundingClientRect().x,
        right: this.sliderClientRect.left + this.sliderClientRect.width,
      }
    );
  }

  moveAt(destinationX, elementType, rangeX) {
    if (destinationX < rangeX.left) {
      destinationX = rangeX.left;
    } else if (destinationX > rangeX.right) {
      destinationX = rangeX.right;
    }

    if (elementType === "left") {
      this.moveLeftThumb(destinationX);
    } else if (elementType === "right") {
      this.moveRightThumb(destinationX);
    }

    this.element.dispatchEvent(this.createRangeSelectEvent({
      from: this.selected.from,
      to: this.selected.to
    }));
  }

  moveLeftThumb(pageX) {
    this.selected.from = this.calculateNewRangeValue(pageX);
    this.handleThumbMove();
  }

  moveRightThumb(pageX) {
    this.selected.to = this.calculateNewRangeValue(pageX);
    this.handleThumbMove();
  }

  calculateNewRangeValue(pageX) {
    return Number(
      (this.minValue +
        (pageX - this.sliderClientRect.left) / (this.sliderClientRect.width)
        * (this.maxValue - this.minValue)
      ).toFixed(0)
    );
  }

  getThumbLeftStyleValue() {
    return `${((this.selected.from - this.minValue) / (this.maxValue - this.minValue) * 100).toFixed(0)}%`;
  }

  getThumbRightStyleValue() {
    return `${100 - ((this.selected.to - this.minValue) / (this.maxValue - this.minValue) * 100).toFixed(0)}%`;
  }

  removeListeners() {
    this.subElements.leftThumb.removeEventListener("pointerdown", this.handleThumbPointerdown);
    this.subElements.rightThumb.removeEventListener("pointerdown", this.handleThumbPointerdown);
    this.subElements.leftThumb.removeEventListener("dragstart", this.handleThumbPointerdown);
    this.subElements.rightThumb.removeEventListener("dragstart", this.handleThumbPointerdown);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeListeners();
    this.remove();
  }
}
