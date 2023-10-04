export default class NotificationMessage {
  static element;

  constructor (message, {duration = 1000, type = "success"} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = this.createTemplate();

    this.element = this.element.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `
  }

  show(appendingToElement = document.body) {
    if (NotificationMessage.element) {
      NotificationMessage.element.destroy();
    }

    NotificationMessage.element = this;
    appendingToElement.append(this.element);

    this.timeOut = setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timeOut);
    this.remove();
  }
}
