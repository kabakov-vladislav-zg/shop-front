import { ComputedRef, WritableComputedRef, Ref, onBeforeUnmount } from 'vue';

class DragHandler {
  protected stepWidth: number;
  protected initShift: number;
  protected minShift: number;
  protected maxShift: number;
  protected initClientX: number;
  protected initStep: number;
  protected minShiftToStep: number;
  protected onDrag: (shift : number, step : number) => void;
  protected onDragEnd: () => void;
  constructor({
    stepWidth,
    initShift,
    initClientX,
    minShiftToStep,
    maxShiftOverflow,
    maxStep,
    onDrag,
    onDragEnd,
  } : {
    stepWidth: number,
    initShift: number,
    initClientX: number,
    minShiftToStep: number,
    maxShiftOverflow: number,
    maxStep: number,
    onDrag: (shift : number, step : number) => void,
    onDragEnd: () => void,
  }) {
    this.stepWidth = stepWidth;
    this.initShift = initShift;
    this.minShiftToStep = minShiftToStep;
    this.maxShift = maxShiftOverflow;
    this.minShift = -((stepWidth * maxStep) + maxShiftOverflow);
    this.initClientX = initClientX;
    this.initStep = Math.abs(Math.round(initShift / stepWidth));
    this.onDrag = onDrag;
    this.onDragEnd = onDragEnd;
    document.addEventListener('pointermove', this);
    document.addEventListener('pointerup', this);
    onDrag(initShift, this.initStep);
  }
  public handleEvent({ type, clientX } : PointerEvent) {
    switch (type) {
      case 'pointermove':
        const shift = this.getShift(clientX);
        const step = this.getStep(clientX);
        this.onDrag(shift, step);
        break;
      case 'pointerup':
        this.destroy();
        this.onDragEnd();
        break;
      default:
    }
  }
  public destroy() {
    document.removeEventListener('pointermove', this);
    document.removeEventListener('pointerup', this);
  }
  protected getShift(clientX : number) {
    let stageShift = clientX + this.initShift - this.initClientX;
    if (stageShift < this.minShift) {
      stageShift = this.minShift;
    } else if (stageShift > this.maxShift) {
      stageShift = this.maxShift;
    }
    return stageShift;
  }
  protected getStep(clientX : number) {
    let step = this.initStep;
    const absShift = Math.abs(clientX - this.initClientX);
    if (absShift > this.minShiftToStep) {
      const sign = (clientX < this.initClientX) ? 1 : -1;
      step += sign * Math.ceil(absShift / this.stepWidth);
    }
    return step;
  }
}

export function useDrag({
  el,
  step,
  maxStep,
  itemsCount,
  isDraggable,
  isStepTransition,
}: {
  el: Ref<HTMLElement | null>
  step: WritableComputedRef<number>
  maxStep: Ref<number>
  itemsCount: Ref<number>
  isDraggable: Ref<boolean>
  isStepTransition: Ref<boolean>
}) {
  const dragHandler = ref<DragHandler | null>(null);
  const shift = ref<number>(0);
  const pointerdown = (e : PointerEvent) => {
    const stageFront = toValue(el);
    if (!stageFront) return;
    const stageBack = stageFront.parentElement;
    if (!stageBack) return;
    const stageBackBox = stageBack.getBoundingClientRect();
    const stageFrontBox = stageFront.getBoundingClientRect();
    const { clientX } = e;
    dragHandler.value = new DragHandler({
      stepWidth: stageFrontBox.width / toValue(itemsCount),
      maxStep: toValue(maxStep),
      initShift: stageFrontBox.left - stageBackBox.left,
      minShiftToStep: 40,
      maxShiftOverflow: 40,
      initClientX: clientX,
      onDrag(currentShift : number, currentStep : number) {
        step.value = currentStep;
        shift.value = currentShift;
        isStepTransition.value = true;
      },
      onDragEnd() {
        dragHandler.value = null;
        shift.value = 0;
      }
    });
  };
  const dragstart = (e : PointerEvent) => {
    e.preventDefault();
  };
  onBeforeUnmount(() => {
    if (dragHandler.value) dragHandler.value.destroy();
  });
  const events = computed(() => {
    if (!toValue(isDraggable)) return {};
    return { pointerdown, dragstart };
  });
  const styles = computed(() => {
    if (!toValue(isDraggable)) return {};
    const shiftX = shift.value;
    const isDragged = !!dragHandler.value;
    const transform = shiftX
      ? `translateX(${shiftX}px)`
      : undefined;
    const transition = isDragged
      ? 'none'
      : undefined;
    const touchAction = 'manipulation';
    return {
      transform,
      touchAction,
      transition,
    }
  });
  return {
    events,
    styles,
  };
}
