import { Tool } from "../components/Canvas";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[] = [];
  private roomId: number;
  private socket: WebSocket;
  private clicked: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private selectedTool: Tool = "rectangle";

  constructor(canvas: HTMLCanvasElement, roomId: number, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.roomId = roomId;
    this.socket = socket;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }

  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.ctx.strokeStyle = "white";
    this.clearCanvas();
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setShape(shape: Tool) {
    this.selectedTool = shape;
  }

  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;
    const width = Math.abs(e.clientX - this.startX);
    const height = Math.abs(e.clientY - this.startY);
    const selected = this.selectedTool;

    let shape: Shape | null = null;

    if (selected === "rectangle") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        width,
        height,
      };
    } else if (selected === "circle") {
      shape = {
        type: "circle",
        centerX: this.startX,
        centerY: this.startY,
        radius: Math.sqrt(width * width + height * height),
      };
    } else if (selected === "line") {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX: e.clientX,
        endY: e.clientY,
      };
    }
    if (!shape) return;
    this.existingShapes.push(shape);
    this.socket.send(
      JSON.stringify({
        type: "CHAT",
        message: JSON.stringify(shape),
        roomId: this.roomId,
      }),
    );
  };

  mouseMoveHandler = (e: MouseEvent) => {
    if (this.clicked) {
      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas();
      if (this.selectedTool === "rectangle")
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      else if (this.selectedTool === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          this.startX,
          this.startY,
          Math.sqrt(width * width + height * height),
          0,
          2 * Math.PI,
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (this.selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  };

  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "CHAT") {
        const shape = JSON.parse(parsedData.message);
        this.existingShapes.push(shape);
        this.clearCanvas();
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.existingShapes.forEach((shape) => {
      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          2 * Math.PI,
        );
        this.ctx.stroke();
        this.ctx.closePath();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    });
  }
}
