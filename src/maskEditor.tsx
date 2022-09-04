import * as React from "react";
import "./maskEditor.less";
import { hexToRgb } from "./utils";

export interface MaskEditorProps {
  src: string;
  canvasRef?: React.MutableRefObject<HTMLCanvasElement>;
  cursorSize?: number;
  onCursorSizeChange?: (size: number) => void;
  maskOpacity?: number;
  maskColor?: string;
  maskBlendMode?: "normal"|"multiply"|"screen"|"overlay"|"darken"|"lighten"|"color-dodge"|"color-burn"|"hard-light"|"soft-light"|"difference"|"exclusion"|"hue"|"saturation"|"color"|"luminosity"
}

export const MaskEditorDefaults = {
  cursorSize: 10,
  maskOpacity: .75,
  maskColor: "#23272d",
  maskBlendMode: "normal",
}

export const MaskEditor: React.FC<MaskEditorProps> = (props: MaskEditorProps) => {
  const src = props.src;
  const cursorSize = props.cursorSize ?? MaskEditorDefaults.cursorSize;
  const maskColor = props.maskColor ?? MaskEditorDefaults.maskColor;
  const maskBlendMode = props.maskBlendMode ?? MaskEditorDefaults.maskBlendMode;
  const maskOpacity = props.maskOpacity ?? MaskEditorDefaults.maskOpacity;

  const canvas = React.useRef<HTMLCanvasElement|null>(null);
  const maskCanvas = React.useRef<HTMLCanvasElement|null>(null);
  const cursorCanvas = React.useRef<HTMLCanvasElement|null>(null);
  const [context, setContext] = React.useState<CanvasRenderingContext2D|null>(null);
  const [maskContext, setMaskContext] = React.useState<CanvasRenderingContext2D|null>(null);
  const [cursorContext, setCursorContext] = React.useState<CanvasRenderingContext2D|null>(null);
  const [size, setSize] = React.useState<{x: number, y: number}>({x: 256, y: 256})

  React.useLayoutEffect(() => {
    if (canvas.current && !context) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      setContext(ctx);
    }
  }, [canvas]);

  React.useLayoutEffect(() => {
    if (maskCanvas.current && !context) {
      const ctx = (maskCanvas.current as HTMLCanvasElement).getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size.x, size.y);
      }
      setMaskContext(ctx);
    }
  }, [maskCanvas]);

  React.useLayoutEffect(() => {
    if (cursorCanvas.current && !context) {
      const ctx = (cursorCanvas.current as HTMLCanvasElement).getContext("2d");
      setCursorContext(ctx);
    }
  }, [cursorCanvas]);

  React.useEffect(() => {
    if (src && context) {
      const img = new Image;
      img.onload = evt => {
        setSize({x: img.width, y: img.height});
        context?.drawImage(img, 0, 0);
      }
      img.src = src;
    }
  }, [src, context]);

  // Pass mask canvas up
  React.useLayoutEffect(() => {
    if (props.canvasRef) {
      props.canvasRef.current = maskCanvas.current;
    }
  }, [maskCanvas]);

  React.useEffect(() => {
    const listener = (evt: MouseEvent) => {
      if (cursorContext) {
        cursorContext.clearRect(0, 0, size.x, size.y);

        cursorContext.beginPath();
        cursorContext.fillStyle = `${maskColor}88`;
        cursorContext.strokeStyle = maskColor;
        cursorContext.arc(evt.offsetX, evt.offsetY, cursorSize, 0, 360);
        cursorContext.fill();
        cursorContext.stroke();
      }
      if (maskContext && evt.buttons > 0) {
        maskContext.beginPath();
        maskContext.fillStyle = (evt.buttons > 1 || evt.shiftKey) ? "#ffffff" : maskColor;
        maskContext.arc(evt.offsetX, evt.offsetY, cursorSize, 0, 360);
        maskContext.fill();
      }
    }
    const scrollListener = (evt: WheelEvent) => {
      if (cursorContext) {
        props.onCursorSizeChange(Math.max(0, cursorSize + (evt.deltaY > 0 ? 1 : -1)));

        cursorContext.clearRect(0, 0, size.x, size.y);

        cursorContext.beginPath();
        cursorContext.fillStyle = `${maskColor}88`;
        cursorContext.strokeStyle = maskColor;
        cursorContext.arc(evt.offsetX, evt.offsetY, cursorSize, 0, 360);
        cursorContext.fill();
        cursorContext.stroke();

        evt.stopPropagation();
        evt.preventDefault();
      }
    }

    cursorCanvas.current?.addEventListener("mousemove", listener);
    if (props.onCursorSizeChange) {
      cursorCanvas.current?.addEventListener("wheel", scrollListener);
    }
    return () => {
      cursorCanvas.current?.removeEventListener("mousemove", listener);
      if (props.onCursorSizeChange) {
        cursorCanvas.current?.removeEventListener("wheel", scrollListener);
      }
    }
  }, [cursorContext, maskContext, cursorCanvas, cursorSize, maskColor, size]);

  const replaceMaskColor = React.useCallback((hexColor: string, invert: boolean) => {
    const imageData = maskContext?.getImageData(0, 0, size.x, size.y);
    const color = hexToRgb(hexColor);
    if (imageData) {
      for (var i = 0; i < imageData?.data.length; i += 4) {
        const pixelColor = ((imageData.data[i] === 255) != invert) ? [255, 255, 255] : color;
        imageData.data[i] = pixelColor[0];
        imageData.data[i + 1] = pixelColor[1];
        imageData.data[i + 2] = pixelColor[2];
        imageData.data[i + 3] = imageData.data[i + 3];
      }
      maskContext?.putImageData(imageData, 0, 0);
    }
  }, [maskContext]);
  React.useEffect(() => replaceMaskColor(maskColor, false), [maskColor]);

  return <div className="react-mask-editor-outer">
    <div
      className="react-mask-editor-inner"
      style={{
        width: size.x,
        height: size.y,
      }}
    >
      <canvas
        ref={canvas}
        style={{
          width: size.x,
          height: size.y,
        }}
        width={size.x}
        height={size.y}
        className="react-mask-editor-base-canvas"
      />
      <canvas
        ref={maskCanvas}
        width={size.x}
        height={size.y}
        style={{
          width: size.x,
          height: size.y,
          opacity: maskOpacity,
          mixBlendMode: maskBlendMode as any,
        }}
        className="react-mask-editor-mask-canvas"
      />
      <canvas
        ref={cursorCanvas}
        width={size.x}
        height={size.y}
        style={{
          width: size.x,
          height: size.y,
        }}
        className="react-mask-editor-cursor-canvas"
      />
    </div>
  </div>
}
