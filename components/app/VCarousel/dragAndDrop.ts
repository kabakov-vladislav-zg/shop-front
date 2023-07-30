import { ComputedRef, Ref } from 'vue';

class DragAndDrop {
  readonly stepWidth: number;
  readonly initShift: number;
  readonly maxShift: number;
  readonly minShift: number;
  readonly initClientX: number;
  readonly initStep: number;
  readonly maxStep: number;
  readonly minShiftToStep = 40;
  readonly onDrag: (shift : number, step : number) => void;
  readonly onDragEnd: () => void;
  constructor({
    stepWidth,
    initShift,
    initClientX,
    maxStep,
    onDrag,
    onDragEnd,
  } : {
    stepWidth: number,
    initShift: number,
    initClientX: number,
    maxStep: number,
    onDrag: (shift : number, step : number) => void,
    onDragEnd: () => void,
  }) {
    this.stepWidth = stepWidth;
    this.initShift = initShift;
    this.maxShift = -((stepWidth * maxStep) + this.minShiftToStep);
    this.minShift = this.minShiftToStep;
    this.initClientX = initClientX;
    this.maxStep = maxStep;
    this.initStep = Math.abs(Math.round(initShift / stepWidth));
    this.onDrag = onDrag;
    this.onDragEnd = onDragEnd;
    document.addEventListener('pointermove', this);
    document.addEventListener('pointerup', this, { once: true });
  }
  handleEvent({ type, clientX } : PointerEvent) {
    switch (type) {
      case 'pointermove':
        const pointerShift = clientX - this.initClientX;
        const shift = this.getShift(pointerShift);
        const step = this.getStep(pointerShift);
        this.onDrag(shift, step);
        break;
      case 'pointerup':
        document.removeEventListener('pointermove', this);
        this.onDragEnd();
        break;
      default:
    }
  }
  getShift(pointerShift : number) {
    let stageShift = pointerShift + this.initShift;
    const { minShift, maxShift } = this;
    if (stageShift > minShift) {
      stageShift = minShift;
    } else if (stageShift < maxShift) {
      stageShift = maxShift;
    }
    return stageShift;
  }
  getStep(pointerShift : number) {
    let step = this.initStep;
    const absShift = Math.abs(pointerShift);
    const signShift = Math.sign(pointerShift);
    const { stepWidth, minShiftToStep, maxStep } = this;
    if (absShift > minShiftToStep) {
      let countShift;
      if (absShift < stepWidth) {
        countShift = Math.ceil(absShift / stepWidth);
      } else {
        countShift = Math.round(absShift / stepWidth);
      }
      step += -signShift * countShift;
    }
    if (step > maxStep) {
      step = maxStep;
    } else if (step < 0) {
      step = 0;
    }
    return step;
  }
}
const getStepWidth = (items : Array<HTMLElement>) => {
  const [firstItem, secondItem] = items;
  if (secondItem) {
    const { left: firstItemX } = firstItem.getBoundingClientRect();
    const { left: secondItemX } = secondItem.getBoundingClientRect();
    return Math.abs(secondItemX - firstItemX)
  } else {
    return firstItem.getBoundingClientRect().width;
  }
};
const getInitShift = (stageBack : HTMLElement, stageFront : HTMLElement) => {
  const stageBackBox = stageBack.getBoundingClientRect();
  const stageFrontBox = stageFront.getBoundingClientRect();
  return stageFrontBox.left - stageBackBox.left;
};
export function useDragAndDrop({
   stageBack,
   stageFront,
   stageItems,
   currentCapacity,
} : {
  stageBack: Ref<HTMLElement | null>
  stageFront: Ref<HTMLElement | null>
  stageItems: Ref<Array<HTMLElement> | []>
  currentCapacity: ComputedRef
}) {
  const isDragged = ref<boolean>(false);
  const dragStep = ref<number>(0);
  const dragShift = ref<number>(0);
  const pointerdown = (e : PointerEvent) => {
    console.log(e)
    const { clientX } = e;
    const stage = {
      back: toValue(stageBack),
      front: toValue(stageFront),
      items: toValue(stageItems),
    };
    if (!stage.back || !stage.front || !stage.items.length) return;
    isDragged.value = true;
    new DragAndDrop({
      stepWidth: getStepWidth(stage.items),
      maxStep: stage.items.length - toValue(currentCapacity),
      initShift: getInitShift(stage.back, stage.front),
      initClientX: clientX,
      onDrag(shift : number, step : number) {
        dragStep.value = step;
        dragShift.value = shift;
      },
      onDragEnd() {
        isDragged.value = false;
        dragShift.value = 0;
      }
    });
  };
  const styles = computed(() => {
    const shift = toValue(dragShift);
    const transform = shift
      ? `translateX(${shift}px)`
      : null;
    return {
      transform,
    }
  });
  const classes = computed(() => {
    return {
      'isDraggable': true,
      'isDragged': toValue(isDragged),
    }
  });
  const step = computed(() => toValue(dragStep));
  return {
    events: {
      pointerdown,
      dragstart: (e : PointerEvent) => {
        e.preventDefault();
      },
    },
    classes,
    styles,
    step,
  }
}