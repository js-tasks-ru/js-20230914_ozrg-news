const tooltipOffsetX = 10;
const tooltipOffsetY = 10;

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
    this.createListeners();
  }

  render(content) {
    if (this.element) {
      this.remove();
    }
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.hidden = false;
    this.element.innerHTML = content;
    document.body.append(this.element);
  }

  handleDocumentPointerover(e) {
    if (e.target.dataset.tooltip) {
      document.addEventListener('pointerout', (e) => this.handleDocumentPointerout(e));
      document.addEventListener('pointermove', (e) => this.handleDocumentPointermove(e));
      document.removeEventListener('pointerover', (e) => this.handleDocumentPointerover(e));
      this.render(e.target.dataset.tooltip);
    }
  }

  handleDocumentPointermove(e) {
    if (this.element) {
      this.element.style.top = e.clientY + tooltipOffsetX + "px";
      this.element.style.left = e.clientX + tooltipOffsetY + "px";
    }
  }

  handleDocumentPointerout(e) {
    if (this.element) {
      this.element.remove();
    }
    if (e.target.dataset.tooltip === undefined) {
      document.removeEventListener('pointerout', (e) => this.handleDocumentPointerout(e));
      document.removeEventListener('pointermove', (e) => this.handleDocumentPointermove(e));
      document.addEventListener('pointerover', (e) => this.handleDocumentPointerover(e));
    }
  }

  createListeners() {
    document.addEventListener('pointerover', (e) => this.handleDocumentPointerover(e));
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    document.removeEventListener('pointerover', (e) => this.handleDocumentPointerover(e));
    document.removeEventListener('pointermove', (e) => this.handleDocumentPointermove(e));
    document.removeEventListener('pointerout', (e) => this.handleDocumentPointerout(e));

    this.remove();
  }
}

export default Tooltip;
