class Tooltip {
  static tooltip = null;

  constructor() {
    if (Tooltip.tooltip) {
      return Tooltip.tooltip;
    } else {
      Tooltip.tooltip = this;
    }
  }

  render(text = '') {
    const el = document.createElement('div');
    el.innerHTML = this.getTemplate(text);
    this.element = el.firstElementChild;
    document.body.append(this.element);
  }

  initialize() {
    this.elementsWithTip = this.getElementsWithTip();
    this.addHandler();
  }

  remove() {
    this.element.remove();
    Tooltip.tooltip = null;
  }

  destroy() {
    this.remove();
  }

  addHandler() {
    this.elementsWithTip.forEach(item => {
      item.element.addEventListener('pointerover', this.pointerOverHandler);
    });
  }

  pointerOverHandler = (event) => {
    if (event.relatedTarget && (event.target !== event.currentTarget)) {
      return;
    }
    this.render();
    this.updatePosition(event.clientX, event.clientY);

    this.element.innerHTML = event.target.dataset.tooltip;

    this.parent = event.target;
    this.parent.addEventListener('pointermove', this.pointerMoveHandler);
    this.parent.addEventListener('pointerout', this.pointerOutHandler);
  }

  pointerOutHandler = (event) => {
    this.parent.removeEventListener('pointermove', this.pointerMoveHandler);
    this.parent.removeEventListener('pointerout', this.pointerOutHandler);
    this.remove();
  }

  pointerMoveHandler = (event) => {
    this.updatePosition(event.clientX, event.clientY);
  }

  updatePosition(clientX, clientY) {
    this.element.style.left = Math.ceil(clientX) + 4 + 'px';
    this.element.style.top = Math.ceil(clientY) + 4 + 'px';
  }

  getElementsWithTip() {
    const result = [];
    document.querySelectorAll('[data-tooltip]').forEach((item) => {
      result.push({
        element: item,
        text: item.dataset.tooltip
      });
    });
    return result;
  }

  getTemplate(text = '') {
    return `<div class="tooltip">${text}</div>`;
  }
}

export default Tooltip;
