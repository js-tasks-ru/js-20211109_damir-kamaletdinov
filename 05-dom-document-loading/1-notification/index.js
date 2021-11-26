export default class NotificationMessage {

  static isExist = false;
  static element;
  static timer;

  constructor(text = '',
    {
      duration = 2000,
      type = 'success'
    } = {}
  ) {

    if (NotificationMessage.isExist) {
      this.remove();
    }

    this.text = text,
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get element() {
    return NotificationMessage.element;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    NotificationMessage.element = element.firstElementChild;
  }

  show(container = document.body) {
    NotificationMessage.isExist = true;

    this.container = container;
    this.container.append(NotificationMessage.element);

    NotificationMessage.timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    NotificationMessage.element.remove();
    NotificationMessage.isExist = false;
    clearTimeout(NotificationMessage.timer);
  }

  destroy() {
    this.remove();
  }

  getDuration() {
    return this.duration / 1000 + "s";
  }

  getTemplate() {
    return `
      <div class="notification ${this.type}" style="--value:${this.getDuration()}">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">${this.text}</div>
        </div>
      </div>
    `;
  }

}
