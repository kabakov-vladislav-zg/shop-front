import { computed, WritableComputedRef, watch } from 'vue';

type Pagination = {
  step: ComputedRef<number>,
  count: Ref<number>,
}
type Arguments = {
  value : WritableComputedRef<number>,
  length : ComputedRef<number>,
  capacity : ComputedRef<number>,
}
export function usePagination({ value, length, capacity } : Arguments) : Pagination {
  const count = ref<number>(0);
  const maxCount = computed(() => length.value - 1);
  const maxStep = computed(() => length.value - capacity.value);
  if (value.value < 0) {
    value.value = 0;
  } if (value.value > maxCount.value) {
    value.value = maxCount.value;
  }
  watch(value, (current) => {
    if (current < 0 ) {
      value.value = 0;
    } else if (current > maxCount.value) {
      value.value = maxCount.value;
    } else {
      count.value = current;
    }
  }, { immediate: true });
  watch(count, (current) => {
    if (current < 0 ) {
      count.value = 0;
    } else if (current > maxCount.value) {
      count.value = maxCount.value;
    } else {
      value.value = current;
    }
  });
  watch(() => `${maxStep.value}-${maxCount.value}`, () => {
    if (count.value > maxCount.value) {
      count.value = maxCount.value;
    }
  });
  const step = computed(() => {
    let step = count.value;
    if (step < 0) return 0;
    if (step > maxStep.value) return maxStep.value;
    return step;
  });
  return {
    step,
    count,
  }
}
