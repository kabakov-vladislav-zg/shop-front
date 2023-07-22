import { computed, ref, toValue, watchEffect } from 'vue';

export function useNavigation(itemsCount, capacity) {
  const innerStep = ref<number>(0);
  const maxStep = computed(() => toValue(itemsCount) - toValue(capacity));
  const innerPage = ref<number>(0);
  const maxPage = computed(() => Math.floor(toValue(itemsCount) / toValue(capacity)));
  const setStep = (value : string | number) => {
    const max = toValue(maxStep);
    let currentStep = Number(value) || 0;
    let currentPage = Math.floor(currentStep / toValue(capacity));
    if (currentStep >= max) {
      currentStep = max;
      currentPage = Math.ceil(currentStep / toValue(capacity));
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
      return setStep(currentPage * toValue(capacity));
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