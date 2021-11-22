export default class ColumnChart {

  constructor(params) {
    const defaultParams = {
      data: [],
      label: '',
      link: '',
      value: 0,
      formatHeading: null
    };
    this.options = {...defaultParams, ...params};

    this.isLoading = !params || this.options.data.length === 0;
    this.chartHeight = 50;

    this.render();
  }

  getTemplate() {
    return `
      <div class="column-chart__title">
        Total ${this.options.label}
        <a href="/sales" class="column-chart__link">View all</a>
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.getHeading()}</div>
        <div data-element="body" class="column-chart__chart">
      `
        + this.getColumns() +
      `
        </div>
      </div>
    `;
  }

  createElement() {
    const element = document.createElement('div');
    element.style.setProperty('--chart-height', this.chartHeight);
    element.className = this.getElementStyleName();
    return element;
  }

  getElementStyleName() {
    let className = "column-chart ";
    if (this.isLoading) {
      className += "column-chart_loading";
    }
    return className;
  }

  getHeading() {
    if (this.options.formatHeading) {
      return this.options.formatHeading(this.options.value);
    }
    return this.options.value;
  }

  getColumn = (columnProps) =>
    `<div style="--value: ${columnProps.value}" data-tooltip="${columnProps.percent}"></div>`

  getColumns() {
    let result = '';
    this.getColumnProps(this.options.data).forEach(columnProps => {
      result += this.getColumn(columnProps);
    });
    return result;
  }

  render() {
    const element = this.createElement();
    element.innerHTML = this.getTemplate();
    this.element = element;
  }

  update(params) {
    this.options = {...this.options, ...params};
    this.element.innerHTML = this.getTemplate();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
