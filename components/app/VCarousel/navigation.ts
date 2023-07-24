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
  const setStep = (value : string | number) => {
    const max = toValue(maxStep);
    let currentStep = Number(value) || 0;
    let currentPage = Math.floor(currentStep / toValue(currentCapacity));
    if (currentStep >= max) {
      currentStep = max;
      currentPage = Math.ceil(currentStep / toValue(currentCapacity));
    } else if (currentStep < 0) {
      currentStep = 0;
      currentPage = 0;
    }
    innerStep.value = currentStep;
    innerPage.value = currentPage
    return {
      step: currentStep,
      page: currentPage,
    };
  };
  const setPage = (value : string | number) => {
    const currentPage = Number(value) || 0;
    if (currentPage === toValue(innerPage)) {
      return {
        step: toValue(innerStep),
        page: toValue(innerPage),
      }
    } else {
      return setStep(currentPage * toValue(currentCapacity));
    }
  };
  const step = computed(() => toValue(innerStep));
  const page = computed(() => toValue(innerPage));

  return {
    step,
    maxStep,
    setStep,
    page,
    maxPage,
    setPage,
  }
}