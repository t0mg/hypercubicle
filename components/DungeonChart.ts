import { DungeonChartData, DungeonChartNode as DungeonChartNode } from "@/types";

const NODE_WIDTH = 140;
const NODE_HEIGHT = 60;
const VERTICAL_SPACING = 80;
const HORIZONTAL_SPACING = 20;

export class DungeonChart extends HTMLElement {
  private _data: DungeonChartData | null = null;
  private _positions = new Map();
  private _maxDepth = 0;
  private _allNodes = [];
  private _transform = { scale: 1, tx: 0, ty: 0 };
  private _svgEl: SVGSVGElement;
  private _groupEl: SVGGElement;

  get data(): DungeonChartData | null {
    return this._data;
  }

  set data(value: DungeonChartData) {
    this._data = JSON.parse(JSON.stringify(value)) as DungeonChartData;
    this.render();
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._injectStyles();
    this.render();
  }

  private _injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
:host {
  --bg-color: #ffffffff;
  --text-color: #333;
  --node-bg: #e1e1e1;
  --node-border: #b0bec5;
  --node-shadow: rgba(0, 0, 0, 0.08);
  --path-node-bg: #e8f5e9;
  --path-node-border: #66bb6a;
  --retirement-node-bg: #ffebee;
  --retirement-node-border: #e57373;
  --connector-color: #b0bec5;
  --path-connector-color: #66bb6a;
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--bg-color);
  font-family: "Pixelated MS Sans Serif", Arial;
}

svg {
  width: 100%;
  height: 100%;
  cursor: grab;
}

svg:active {
    cursor: grabbing;
}

.node-rect {
  stroke-width: 1.5px;
  rx: 8;
  ry: 8;
  transition: fill 0.2s ease-in-out, stroke 0.2s ease-in-out;
}

.node-text {
  font-size: 12px;
  font-weight: 500;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: var(--text-color);
  pointer-events: none; /* Allow events to pass through text to the rect */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.connector-label {
  font-size: 11px;
  font-weight: 500;
  fill: #546e7a;
  text-anchor: middle;
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
    `;
    this.shadowRoot.appendChild(style);
  }

  private _createSVGElement<K extends keyof SVGElementTagNameMap>(tag: K, attributes: Record<string, string> = {}): SVGElementTagNameMap[K] {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag) as SVGElementTagNameMap[K];
    for (const key in attributes) {
      el.setAttribute(key, attributes[key]);
    }
    return el;
  }

  private _prepareTree(node: DungeonChartNode, depth = 0, parent: DungeonChartNode | null = null): number {
    const n = node as DungeonChartNode;
    const p = parent as DungeonChartNode | null;

    n.depth = depth;
    n.parent = p;
    this._maxDepth = Math.max(this._maxDepth, depth);
    this._allNodes.push(n);

    if (!n.children || n.children.length === 0) {
      n.leafCount = 1;
      return 1;
    }

    let count = 0;
    for (const child of n.children) {
      count += this._prepareTree(child, depth + 1, n);
    }
    n.leafCount = count;
    return count;
  }

  private _calculateColumns(node: DungeonChartNode, cIdx: number) {
    (node as any).columnIndex = cIdx;

    if (!node.children || node.children.length === 0) {
      return;
    }

    const nodeWithChildren = node.children.find(c => c.children && c.children.length > 0);
    const leafChildren = node.children.filter(c => !c.children || c.children.length === 0);

    if (nodeWithChildren) {
      this._calculateColumns(nodeWithChildren, cIdx);
    }

    let rightOffset = 1;
    let leftOffset = -1;
    leafChildren.forEach((child, i) => {
      // Alternate placing leaves left and right of the parent column
      if (i % 2 === 0) {
        this._calculateColumns(child, cIdx + rightOffset);
        rightOffset++;
      } else {
        this._calculateColumns(child, cIdx + leftOffset);
        leftOffset--;
      }
    });
  }

  private _calculatePositions() {
    let minC = 0, maxC = 0;
    for (const node of this._allNodes as any[]) {
      minC = Math.min(minC, node.columnIndex);
      maxC = Math.max(maxC, node.columnIndex);
    }

    const xOffset = -minC * (NODE_WIDTH + HORIZONTAL_SPACING) + HORIZONTAL_SPACING;
    const totalRenderHeight = this._maxDepth * (NODE_HEIGHT + VERTICAL_SPACING);

    for (const node of this._allNodes as any[]) {
      const y = totalRenderHeight - (node.depth * (NODE_HEIGHT + VERTICAL_SPACING));
      const x = xOffset + node.columnIndex * (NODE_WIDTH + HORIZONTAL_SPACING);
      this._positions.set(node.id, { x, y });
    }
  }

  private _drawConnector(parentNode: DungeonChartNode, childNode: DungeonChartNode) {
    const parentPos = this._positions.get(parentNode.id);
    const childPos = this._positions.get(childNode.id);
    const isPath = this._data.path.includes(childNode.id) && this._data.path.includes(parentNode.id);

    const startX = parentPos.x + NODE_WIDTH / 2;
    const startY = parentPos.y;
    const endX = childPos.x + NODE_WIDTH / 2;
    const endY = childPos.y + NODE_HEIGHT;
    const midY = startY - VERTICAL_SPACING / 2;

    const connectorGroup = this._createSVGElement('g');

    const line = this._createSVGElement('path', {
      d: `M ${startX} ${startY} V ${midY} H ${endX} V ${endY}`,
      stroke: isPath ? 'var(--path-connector-color)' : 'var(--connector-color)',
      'stroke-width': isPath ? '2.5' : '1.5',
      fill: 'none'
    });
    connectorGroup.appendChild(line);

    const labelText = this._data.linkLabels[childNode.id];
    if (labelText) {
      const label = this._createSVGElement('text', {
        class: 'connector-label',
        x: endX + '',
        y: midY + '',
        dy: '-16px',
        filter: 'url(#solid)'
      });
      label.textContent = labelText;
      if (isPath) {
        label.style.fill = 'var(--path-connector-color)';
        label.style.fontWeight = '700';
      }
      connectorGroup.appendChild(label);
    }

    if (isPath) {
      this._groupEl.appendChild(connectorGroup);
    } else {
      this._groupEl.prepend(connectorGroup);
    }
  }

  private _drawNode(node: DungeonChartNode) {
    const pos = this._positions.get(node.id);
    const isPathNode = this._data.path.includes(node.id);
    const nodeGroup = this._createSVGElement('g');

    const rect = this._createSVGElement('rect', {
      x: pos.x,
      y: pos.y,
      width: NODE_WIDTH + '',
      height: NODE_HEIGHT + '',
      fill: isPathNode ? 'var(--path-node-bg)' : 'var(--node-bg)',
      stroke: isPathNode ? 'var(--path-node-border)' : 'var(--node-border)',
      class: 'node-rect',
      filter: 'url(#shadow)'
    });

    if (node.isRetirementNode) {
      rect.style.fill = 'var(--retirement-node-bg)';
      rect.style.stroke = 'var(--retirement-node-border)';
    }
    nodeGroup.appendChild(rect);

    const text = this._createSVGElement('text', { class: 'node-text' });

    const words = node.label?.split(' ');
    let line = '';
    const lines = [];
    const maxLineWidth = NODE_WIDTH - 20;

    for (let n = 0; n < words?.length; n++) {
      const testLine = line + words[n] + ' ';
      const tempText = this._createSVGElement('text', { class: 'node-text', style: 'visibility: hidden;' });
      tempText.textContent = testLine;
      this._svgEl.appendChild(tempText);
      const testWidth = tempText.getComputedTextLength();
      this._svgEl.removeChild(tempText);

      if (testWidth > maxLineWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const lineHeight = 16;
    const startY = (pos.y + NODE_HEIGHT / 2) - ((lines.length - 1) * lineHeight) / 2;
    text.setAttribute('y', startY + '');

    lines.forEach((lineText, index) => {
      const tspan = this._createSVGElement('tspan', {
        x: pos.x + NODE_WIDTH / 2,
        dy: index === 0 ? '0' : `${lineHeight}px`
      });
      tspan.textContent = lineText.trim();
      text.appendChild(tspan);
    });

    nodeGroup.appendChild(text);
    this._groupEl.appendChild(nodeGroup);
  }

  private _createDefs() {
    const defs = this._createSVGElement('defs');
    const filter = this._createSVGElement('filter', { id: 'shadow', x: '-50%', y: '-50%', width: '200%', height: '200%' });
    const feDropShadow = this._createSVGElement('feDropShadow', {
      dx: '2',
      dy: '2',
      stdDeviation: '3',
      'flood-color': 'var(--node-shadow)'
    });
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
    const filter2 = this._createSVGElement('filter', { id: 'solid', x: '0', y: '0', width: '1', height: '1' });
    filter2.innerHTML = `
      <feFlood flood-color="var(--bg-color)" result="bg" />
      <feMerge>
        <feMergeNode in="bg"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>`;
    defs.appendChild(filter2);
    this._groupEl.parentElement.appendChild(defs);
  }

  private _getTouchDistance(touches: TouchList): number {
    const [touch1, touch2] = [touches[0], touches[1]];
    return Math.sqrt(Math.pow(touch2.clientX - touch1.clientX, 2) + Math.pow(touch2.clientY - touch1.clientY, 2));
  }

  private _setupZoomAndPan() {
    let isPanning = false;
    let startPoint = { x: 0, y: 0 };
    let startDistance = 0;

    const applyTransform = () => {
      this._groupEl.setAttribute('transform', `translate(${this._transform.tx}, ${this._transform.ty}) scale(${this._transform.scale})`);
    };

    this._svgEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 1.1;
      const direction = e.deltaY < 0 ? zoomFactor : 1 / zoomFactor;

      const svgRect = this._svgEl.getBoundingClientRect();
      const mouseX = e.clientX - svgRect.left;
      const mouseY = e.clientY - svgRect.top;

      this._transform.tx = mouseX - (mouseX - this._transform.tx) * direction;
      this._transform.ty = mouseY - (mouseY - this._transform.ty) * direction;
      this._transform.scale *= direction;

      applyTransform();
    });

    this._svgEl.addEventListener('mousedown', (e) => {
      isPanning = true;
      startPoint = { x: e.clientX, y: e.clientY };
      this._svgEl.style.cursor = 'grabbing';
    });

    this._svgEl.addEventListener('mousemove', (e) => {
      if (!isPanning) return;
      const endPoint = { x: e.clientX, y: e.clientY };
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      this._transform.tx += dx;
      this._transform.ty += dy;
      startPoint = endPoint;
      applyTransform();
    });

    const stopPanning = () => {
      if (isPanning) {
        isPanning = false;
        this._svgEl.style.cursor = 'grab';
      }
    };

    this._svgEl.addEventListener('mouseup', stopPanning);
    this._svgEl.addEventListener('mouseleave', stopPanning);

    this._svgEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isPanning = true;
        startPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        this._svgEl.style.cursor = 'grabbing';
      } else if (e.touches.length === 2) {
        startDistance = this._getTouchDistance(e.touches);
      }
    });

    this._svgEl.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1 && isPanning) {
        e.preventDefault();
        const endPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        const dx = endPoint.x - startPoint.x;
        const dy = endPoint.y - startPoint.y;
        this._transform.tx += dx;
        this._transform.ty += dy;
        startPoint = endPoint;
        applyTransform();
      } else if (e.touches.length === 2) {
        e.preventDefault();
        const newDistance = this._getTouchDistance(e.touches);
        const direction = newDistance / startDistance;

        const svgRect = this._svgEl.getBoundingClientRect();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const centerX = ((touch1.clientX + touch2.clientX) / 2) - svgRect.left;
        const centerY = ((touch1.clientY + touch2.clientY) / 2) - svgRect.top;

        this._transform.tx = centerX - (centerX - this._transform.tx) * direction;
        this._transform.ty = centerY - (centerY - this._transform.ty) * direction;
        this._transform.scale *= direction;

        startDistance = newDistance;

        applyTransform();
      }
    });

    this._svgEl.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        stopPanning();
      }
    });
  }

  private _centerChart() {
    const chartBounds = this._groupEl.getBBox();
    const containerBounds = this.getBoundingClientRect();

    if (chartBounds.width === 0 || chartBounds.height === 0) return;

    const padding = 80;
    const scaleX = containerBounds.width / (chartBounds.width + padding);
    const scaleY = containerBounds.height / (chartBounds.height + padding);
    const scale = Math.min(scaleX, scaleY, 1);

    this._transform.scale = scale;
    this._transform.tx = (containerBounds.width / 2) - (chartBounds.x + chartBounds.width / 2) * scale;
    this._transform.ty = (containerBounds.height / 2) - (chartBounds.y + chartBounds.height / 2) * scale;

    this._groupEl.setAttribute('transform', `translate(${this._transform.tx}, ${this._transform.ty}) scale(${this._transform.scale})`);
  }

  render() {
    this._allNodes = [];
    this._positions = new Map();
    this._maxDepth = 0;

    if (this._svgEl) {
      this.shadowRoot.removeChild(this._svgEl);
    }
    if (!this._data) {
      return;
    }

    this._svgEl = this._createSVGElement("svg");
    this.shadowRoot.appendChild(this._svgEl);

    this._groupEl = this._createSVGElement("g"); // Main group for all elements
    this._svgEl.appendChild(this._groupEl);

    this._createDefs();
    this._prepareTree(this._data.nodes);

    this._calculateColumns(this._data.nodes, 0);
    this._calculatePositions();

    // Draw connectors first so they are behind nodes
    for (const node of this._allNodes) {
      if (node.parent) {
        this._drawConnector(node.parent, node);
      }
    }

    // Draw nodes on top of connectors
    for (const node of this._allNodes) {
      this._drawNode(node);
    }

    this._centerChart();
    this._setupZoomAndPan();

  }
}

customElements.define('dungeon-chart', DungeonChart);