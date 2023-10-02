export default class NotificationMessage {
  static shown = false;

  constructor (message, {duration = 1000, type = "success"} = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = `
      <div class="notification ${this.type}" style="--value:${this.duration}ms">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;

    this.element = this.element.firstElementChild;
  }

  show(appendingToElement = document.body) {
    if (!NotificationMessage.shown) {
      NotificationMessage.shown = true;
      appendingToElement.append(this.element);

      setTimeout(() => this.remove(), this.duration);
    }
  }

  remove() {
    NotificationMessage.shown = false;
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
