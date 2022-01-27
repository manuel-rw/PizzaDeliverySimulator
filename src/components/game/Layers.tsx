export const Layers = {
  BACKGROUND: 0,
  MESH: 1,
  MESH_LABELS: 1,
  STORE_POINT: 2,
  DELIVERY_POINT: 2,
  DELIVERY_ANIMATION: 3,
};

export function defaultCanvasProperties(canvas: HTMLCanvasElement, width: number, height: number, zIndex: number) {
  canvas.width = width;
  canvas.height = height;
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = zIndex.toString();
}
