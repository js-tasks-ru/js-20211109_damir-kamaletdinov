export default class SortableTable {
  constructor(headersConfig = [], {
    data = [],
    sorted = {}
  } = {}) {


    this.isSortLocally = true;
    this.headerConfig = headersConfig;
    this.data = Array.isArray(data) ? data : data.data;
    this.sortOrder = sorted.order;
    this.sortField = sorted.id;

    this.render();
    this.sort(this.sortField, this.sortOrder);
    this.addHandlers();
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  remove() {
    this.element.remove();
    this.subElements = {};
  }

  destroy() {
    this.remove();
  }

  addHandlers() {
    this.subElements.sortControls.forEach(item => {
      item.addEventListener('pointerdown', () => {
        this.sortControlClicked(item);
      });
    });
  }

  sortControlClicked(item) {
    const sortField = item.dataset.id;
    const sortOrder = this.revertSortOrder(this.sortOrder);
    this.sort(sortField, sortOrder);
  }

  revertSortOrder(order = '') {
    const reverted = {
      asc: 'desc',
      desc: 'asc'
    };
    return reverted[order];
  }

  sort(field = '', order = '') {
    this.sortField = field;
    this.sortOrder = order;

    if (this.isSortLocally) {
      this.data = this.sortOnClient(field, order);
    } else {
      this.data = this.sortOnServer();
    }

    this.updateSubElements();
  }

  sortOnServer() {
    return [...this.data];
  }

  sortOnClient(field, order) {
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];
    const arrCopy = [...this.data];
    const locales = ['ru', 'en'];
    const sortType = (this.headerConfig.find(obj => obj.id === field)).sortType;

    const getSortFunction = (a, b) => {
      if (sortType === "string") {
        return sortByStringFunction(a, b);
      } else {
        return sortByNumberFunction(a, b);
      }
    };

    const sortByStringFunction = (a, b) => {
      return direction * a[field].localeCompare(b[field], locales, { caseFirst: 'upper' });
    };

    const sortByNumberFunction = (a, b) => {
      return direction * (a[field] - b[field]);
    };

    return arrCopy.sort((a, b) => getSortFunction(a, b));
  }

  updateSubElements() {
    this.updateBody();
    this.updateHeader();
  }

  updateBody() {
    this.subElements.body.innerHTML = this.getBody(this.data);
  }

  updateHeader() {
    this.updateArrowPosition();
  }

  updateArrowPosition() {
    this.subElements.sortControls.forEach((item) => {
      if (item.dataset.sortable && item.dataset.id === this.sortField) {
        item.dataset.order = this.sortOrder;
        item.append(this.subElements.arrow);
      }
    });
  }

  getSubElements() {
    const dataElements = this.element.querySelectorAll("[data-element]");
    let result = {};
    dataElements.forEach((item) => {
      result[item.dataset.element] = item;
    });

    result.sortControls = result.header.querySelectorAll('[data-sortable=\"true\"]');

    return result;
  }

  getHeader(headerConfig = []) {
    return headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="${this.sortOrder}">
            <span>${item.title}</span>
            ${this.getArrowTemplate(item.id)}
        </div>
      `;
    }).join('');
  }

  getArrowTemplate(id) {
    if (this.sortField === id) {
      return `
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
    `;
    }
    return '';
  }

  getBody(data = []) {
    return data.map(item => {
      const imageUrl = item.images ? item.images[0].url : 'https://via.placeholder.com/32';
      return `
        <a href="/products/${item.id}" class="sortable-table__row">${this.getRow(item)}</a>
      `;
    }).join('');
  }

  getRow(dataItem) {
    return this.headerConfig.map(headerItem => {
      const item = dataItem[headerItem.id];
      if (headerItem.template) {
        return headerItem.template(item);
      }
      return `
        <div class="sortable-table__cell">${item}</div>
      `;
    }).join('');
  }

  getTemplate() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getHeader(this.headerConfig)}
        </div>
        <div data-element="body" class="sortable-table__body">
            ${this.getBody(this.data)}
        </div>
      </div>
    `;
  }
}
