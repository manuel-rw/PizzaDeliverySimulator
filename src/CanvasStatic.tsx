import * as React from 'react';

type StaticCanvasCtxType = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
  setOffset: (x: number, y: number) => void;
  setSize: (width: number, height: number) => void;
  setCanvasScale: (scale: number) => void;
  setCanvasCtx: (ctx: CanvasRenderingContext2D | null) => void;
  setCanvasRef: (canvas: HTMLCanvasElement | null) => void;
};

export const StaticCanvasContext = React.createContext<StaticCanvasCtxType>(null);

export default function StaticCanvasProvider({ children }: { children: React.ReactNode }) {
  const [canvas, setCanvas] = React.useState<HTMLCanvasElement | null>(null);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const [scale, setScale] = React.useState<number>(1);
  const [offsetX, setOffsetX] = React.useState<number>(0);
  const [offsetY, setOffsetY] = React.useState<number>(0);

  const setOffset = (x: number, y: number) => {
    setOffsetX(x);
    setOffsetY(y);
  };

  const setSize = (width: number, height: number) => {
    setWidth(width);
    setHeight(height);
  };

  const setCanvasScale = (scale: number) => {
    setScale(scale);
  };

  const setCanvasCtx = (ctx: CanvasRenderingContext2D | null) => {
    setCtx(ctx);
  };

  const setCanvasRef = (canvas: HTMLCanvasElement | null) => {
    setCanvas(canvas);
  };

  const value = React.useMemo(
    () => ({
      canvas,
      ctx,
      width,
      height,
      scale,
      offsetX,
      offsetY,
      setOffset,
      setSize,
      setCanvasScale,
      setCanvasCtx,
      setCanvasRef,
    }),
    [canvas],
  );

  return <StaticCanvasContext.Provider value={value}>{children}</StaticCanvasContext.Provider>;
}
