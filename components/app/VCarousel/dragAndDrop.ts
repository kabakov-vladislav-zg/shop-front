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
    maxShift,
    initClientX,
    maxStep,
    initStep,
    onDrag,
    onDragEnd,
  } : {
    stepWidth: number,
    initShift: number,
    maxShift: number,
    initClientX: number,
    maxStep: number,
    initStep: number,
    onDrag: (shift : number, step : number) => void,
    onDragEnd: () => void,
  }) {
    this.stepWidth = stepWidth;
    this.initShift = initShift;
    this.maxShift = -(maxShift + this.minShiftToStep);
    this.minShift = this.minShiftToStep;
    this.initClientX = initClientX;
    this.maxStep = maxStep;
    this.initStep = initStep;
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

export function useDragAndDrop({
   stageBack,
   stageFront,
   stageItems,
   capacity,
   step,
} : {
  stageBack: Ref<HTMLElement | null>
  stageFront: Ref<HTMLElement | null>
  stageItems: Ref<Array<HTMLElement> | []>
  capacity: ComputedRef
  step: ComputedRef
}) {
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
  const onpointermove = ({ stepWidth, prosceniumX, startClientX, startCount }, e) => {
    const pointerShift = e.clientX - startClientX;
    const prosceniumShift = prosceniumX + pointerShift;
    const count = this.getCountFromShift({
      stepWidth,
      startCount,
      pointerShift,
    });
    this.move(count);
    this.prosceniumStyle = `transform: translateX(${prosceniumShift}px)`;
  };
  const ontransitionstart = () => {
    this.isTransition = true;
  };
  const ontransitionend = () => {
    this.isTransition = false;

    if (Number.isInteger(this.stack)) {
      this.counter = this.stack;
    }
    this.stack = NaN;
  };
  const pointerdown = ({ clientX } : PointerEvent) => {
    const stage = {
      back: toValue(stageBack),
      front: toValue(stageFront),
      items: toValue(stageItems),
    };
    if (!stage.back || !stage.front || !stage.items.length) return;
    const initShift = getInitShift(stage.back, stage.front);
    const stepWidth = getStepWidth(stage.items);
    const initStep = toValue(step);
    const maxStep = stage.items.length - toValue(capacity);
    const maxShift = stepWidth * maxStep;
    const initClientX = clientX;
    new DragAndDrop({
      stepWidth,
      initShift,
      maxShift,
      maxStep,
      initStep,
      initClientX,
      onDrag(shift : number, step : number) {
        console.log('shift', shift)
        console.log('step', step)
      },
      onDragEnd() {
      }
    });
  };
  return {
    events: {
      pointerdown,
      dragstart: (e : PointerEvent) => {
        e.preventDefault();
      },
    },
    bindings: null,
    step: null,
  }
}