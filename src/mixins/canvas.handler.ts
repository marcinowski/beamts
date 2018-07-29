interface Point {
  x: number;
  y: number;
}

export class CanvasHandler {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private prevPoint?: Point = undefined;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Undefined Canvas context');
    }
    this.ctx = ctx;
  }

  public transformEventCoordinates(e: MouseEvent): Point {
    const { left, top } = this.canvas.getBoundingClientRect();
    const rawX = e.clientX - left;
    const rawY = e.clientY - top;
    const x = rawX - (rawX % 10);
    const y = rawY - (rawY % 10);
    return { x, y };
  }

  public drawPoint(e: MouseEvent) {
    const point = this.transformEventCoordinates(e);
    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(point.x, point.y, 1, 1);
    this.ctx.closePath();
  }

  public drawLine(e: MouseEvent) {
    const point = this.transformEventCoordinates(e);
    if (!this.prevPoint) {
      this.prevPoint = point;
      return;
    }
    this.ctx.beginPath();
    this.ctx.moveTo(this.prevPoint.x, this.prevPoint.y);
    this.ctx.lineTo(point.x, point.y);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.closePath();
    this.prevPoint = point;
  }
}
