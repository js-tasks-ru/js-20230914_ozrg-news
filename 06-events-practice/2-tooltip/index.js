class Tooltip {
  static instance;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
    this.initialize();
  }

  initialize () {
    this.initializeFunctions();
    this.createListeners();
  }

  render(content) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.hidden = false;
    this.element.innerHTML = content;
    document.body.append(this.element);
  }

  initializeFunctions() {
    this.handleDocumentPointerover = this._handleDocumentPointerover.bind(this);
    this.handleDocumentMousemove = this._handleDocumentMousemove.bind(this);
    this.handleDocumentPointerout = this._handleDocumentPointerout.bind(this);
  }

  _handleDocumentPointerover(e) {
    if (e.target.dataset.tooltip !== undefined) {
      document.addEventListener('pointerout', this.handleDocumentPointerout);
      document.removeEventListener('pointerover', this.handleDocumentPointerover);
      this.render(e.target.dataset.tooltip);
    }
  }

  _handleDocumentMousemove(e) {
    if (this.element) {
      this.element.style.top = e.clientY + 10 + "px";
      this.element.style.left = e.clientX + 10 + "px";
    }
  }

  _handleDocumentPointerout(e) {
    if (this.element) {
      this.element.remove();
    }
    if (e.target.dataset.tooltip === undefined) {
      document.removeEventListener('pointerout', this.handleDocumentPointerout);
      document.addEventListener('pointerover', this.handleDocumentPointerover);
    }
  }

  createListeners() {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('pointerover', this.handleDocumentPointerover);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener('pointerover', this.handleDocumentPointerover);
    document.removeEventListener('pointerout', this.handleDocumentPointerout);

    this.remove();
  }
}

export default Tooltip;
