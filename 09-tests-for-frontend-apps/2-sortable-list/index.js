const ITEM_STYLE_NAME = "sortable-list__item";
const DRAGGING_ITEM_STYLE_NAME = "sortable-list__item_dragging";

export default class SortableList {

  constructor({
    items = []
  } = {}) {
    this.items = items;

    this.render();
  }

  render() {
    const list = document.createElement('ul');
    list.classList.add('sortable-list');

    for (const item of this.items) {
      item.classList.add(ITEM_STYLE_NAME);
      list.append(item);
    }

    this.element = list;
    this.addHandlers();
  }

  addHandlers() {
    this.element.addEventListener('pointerdown', this.elementPointerDownHandler);
  }

  elementPointerDownHandler = (event) => {
    const element = event.target.closest('.' + ITEM_STYLE_NAME);

    if (!element) {
      return;
    }

    if (event.target.closest("[data-grab-handle]")) {
      event.preventDefault();
      this.dragStart(event, element);
    }

    if (event.target.closest("[data-delete-handle]")) {
      event.preventDefault();
      this.deleteElement(element);
    }

  }

  dragStart = (event, element) => {
    this.draggedItem = element;
    this.draggedItemInitialLeft = this.draggedItem.getBoundingClientRect().left;
    this.draggedItemInitialTop = this.draggedItem.getBoundingClientRect().top;
    this.eventInitialX = event.clientX;
    this.eventInitialY = event.clientY;

    const itemWidth = this.draggedItem.offsetWidth + 'px';
    const itemHeight = this.draggedItem.offsetHeight + 'px';

    this.draggedItem.style.width = itemWidth;
    this.draggedItem.style.height = itemHeight;
    this.draggedItem.style.left = this.draggedItemInitialLeft + 'px';
    this.draggedItem.style.top = this.draggedItemInitialTop + 'px';
    this.draggedItem.classList.add(DRAGGING_ITEM_STYLE_NAME);

    this.placeholderItem = this.createPlaceholder();
    this.placeholderItem.style.width = itemWidth;
    this.placeholderItem.style.height = itemHeight;

    this.draggedItem.after(this.placeholderItem);
    this.element.append(this.draggedItem);

    document.addEventListener('pointermove', this.dragMove);
    document.addEventListener('pointerup', this.dragStop);
  }

  dragMove = (event) => {
    const deltaX = event.clientX - this.eventInitialX;
    const deltaY = event.clientY - this.eventInitialY;
    this.draggedItem.style.left = this.draggedItemInitialLeft + deltaX + 'px';
    this.draggedItem.style.top = this.draggedItemInitialTop + deltaY + 'px';

    const prevElem = this.placeholderItem.previousElementSibling;
    const nextElem = this.placeholderItem.nextElementSibling;

    if (prevElem) {
      if (event.clientY < prevElem.getBoundingClientRect().bottom) {
        return prevElem.before(this.placeholderItem);
      }
    }

    if (nextElem) {
      if (event.clientY > nextElem.getBoundingClientRect().top) {
        return nextElem.after(this.placeholderItem);
      }
    } else {
      return this.element.append(this.placeholderItem);
    }
  }

  dragStop = () => {
    this.draggedItem.style = '';
    this.draggedItem.classList.remove(DRAGGING_ITEM_STYLE_NAME);
    this.placeholderItem.replaceWith(this.draggedItem);
    this.draggedItem = null;
    this.draggedItemInitialLeft = 0;
    this.draggedItemInitialTop = 0;

    document.removeEventListener('pointermove', this.dragMove);
    document.removeEventListener('pointerup', this.dragStop);
  }

  deleteElement(element) {
    element.remove();
  }

  remove() {
    this.element.remove();
    this.draggedItem = null;
    this.placeholderItem = null;
  }

  destroy() {
    this.remove();
  }

  createPlaceholder() {
    const element = document.createElement('li');
    element.classList.add('sortable-list__placeholder');
    return element;
  }
}
