import { computed, ref, toValue, watch, ComputedRef, WritableComputedRef } from 'vue';

export function useNavigation({
  itemsCount,
  currentCapacity,
} : {
  itemsCount : ComputedRef<number>,
  currentCapacity : ComputedRef<number>,
}) {
  const innerStep = ref<number>(0);
  const maxStep = computed(() => toValue(itemsCount) - toValue(currentCapacity));
  const innerPage = ref<number>(0);
  const maxPage = computed(() => Math.ceil(toValue(maxStep) / toValue(currentCapacity)));
  const isPageTransition = ref<boolean>(false);
  const setPosition = (step : number) => {
    const position = {
      step: toValue(innerStep),
      page: toValue(innerPage),
    };
    if (step === toValue(innerStep)) {
      return position;
    }
    const max = toValue(maxStep);
    if (step >= max) {
      position.step = max;
      position.page = Math.ceil(step / toValue(currentCapacity));
    } else if (step < 0) {
      position.step = 0;
      position.page = 0;
    } else {
      position.step = step;
      position.page = Math.floor(step / toValue(currentCapacity));
    }
    innerStep.value = position.step;
    innerPage.value = position.page
  };
  const setStep = (value : string | number) => {
    isPageTransition.value = false;
    const step = Number(value) || 0;
    setPosition(step);
  };
  const setPage = (value : string | number) => {
    isPageTransition.value = true;
    const step = (Number(value) || 0) * toValue(currentCapacity);
    setPosition(step);
  };
  const classes = computed(() => {
    return toValue(isPageTransition)
      ? { 'isTransition-page': true }
      : { 'isTransition-step': true };
  });
  return {
    step: readonly(innerStep),
    maxStep,
    setStep,
    page: readonly(innerPage),
    maxPage,
    setPage,
    classes,
  }
}