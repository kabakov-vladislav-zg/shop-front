import { computed, ref, toValue, MaybeRefOrGetter, WritableComputedRef } from 'vue';

/**
 * Navigation controls.
 */
export function useNavigation({
  itemsCount,
  capacityCurrent,
  externalStep,
  externalPage,
} : {
  itemsCount : MaybeRefOrGetter<number>,
  capacityCurrent : MaybeRefOrGetter<number>,
  externalStep : WritableComputedRef<string | number>,
  externalPage : WritableComputedRef<string | number>,
}) {
  const innerStep = ref(0);
  const maxStep = computed(() => toValue(itemsCount) - toValue(capacityCurrent));
  const innerPage = ref(0);
  const maxPage = computed(() => Math.ceil(toValue(maxStep) / toValue(capacityCurrent)));
  const isStepTransition = ref(true);
  const getPosition = (step : number) => {
    if (step <= 0) {
      return {
        step: 0,
        page: 0,
      };
    } else if (step >= maxStep.value) {
      return {
        step: maxStep.value,
        page: maxPage.value,
      };
    } else {
      return {
        step,
        page: Math.floor(step / toValue(capacityCurrent)),
      };
    }
  };
  const setPosition = (step: number, page: number) => {
    innerStep.value = step;
    innerPage.value = page;
    externalStep.value = step;
    externalPage.value = page;
  };
  const setTransition = (step: number) => {
    const range = Math.abs(step - innerStep.value);
    isStepTransition.value = range < toValue(capacityCurrent);
  };
  const setStep = (value: number) => {
    const { step, page } = getPosition(value);
    setTransition(step);
    setPosition(step, page);
  };
  const step = computed({
    get() {
      return innerStep.value;
    },
    set(value: number) {
      if (value === innerStep.value) return;
      setStep(value);
    },
  });
  const page = computed({
    get() {
      return innerPage.value;
    },
    set(value: number) {
      if (value === innerPage.value) return;
      setStep(value * toValue(capacityCurrent));
    },
  });
  watch(externalStep, (value) => step.value = Number(value) || 0);
  watch(externalPage, (value) => page.value = Number(value) || 0);
  watch(maxStep, () => setStep(innerStep.value));
  return {
    step,
    maxStep,
    page,
    maxPage,
    isStepTransition,
  }
}