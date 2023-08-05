import { computed, ref, toValue, ComputedRef } from 'vue';

export function useNavigation({
  itemsCount,
  capacityCurrent,
} : {
  itemsCount : ComputedRef<number>,
  capacityCurrent : ComputedRef<number>,
}) {
  const innerStep = ref<number>(0);
  const maxStep = computed(() => toValue(itemsCount) - toValue(capacityCurrent));
  const innerPage = ref<number>(0);
  const maxPage = computed(() => Math.ceil(toValue(maxStep) / toValue(capacityCurrent)));
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
      position.page = Math.ceil(step / toValue(capacityCurrent));
    } else if (step < 0) {
      position.step = 0;
      position.page = 0;
    } else {
      position.step = step;
      position.page = Math.floor(step / toValue(capacityCurrent));
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
    const step = (Number(value) || 0) * toValue(capacityCurrent);
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