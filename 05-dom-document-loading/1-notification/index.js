export default class NotificationMessage {

  static notification;
  static timer;

  constructor(text = '',
    {
      duration = 2000,
      type = 'success'
    } = {}
  ) {

    this.text = text,
    this.duration = duration;
    this.type = type;

    this.render();
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
  }

  show(container = document.body) {
    if (NotificationMessage.notification) {
      NotificationMessage.notification.remove();
    }
    NotificationMessage.notification = this;

    this.container = container;
    this.container.append(this.element);

    NotificationMessage.timer = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove() {
    this.element.remove();
    NotificationMessage.notification = null;
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
