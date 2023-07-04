import { onMounted, onUnmounted } from 'vue';

type SustainableListenerArguments = {
  getTarget: () => any,
  event: String,
  callback: (e: any) => void,
  init: (target: any, callback: (e: any) => void) => void,
}
export function useSustainableListener({ getTarget, event, callback, init } : SustainableListenerArguments) {
  let subscribersCount = 0;
  return () => {
    onMounted(() => {
      if (!subscribersCount) {
        const target = getTarget();
        init(target, callback);
        target.addEventListener(event, callback);
      }
      ++subscribersCount;
    });
    onUnmounted(() => {
      --subscribersCount;
      if (!subscribersCount) {
        const target = getTarget();
        target.removeEventListener(event, callback);
      }
    });
  };
}
