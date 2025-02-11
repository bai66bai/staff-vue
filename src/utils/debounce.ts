type DebouncedFunction = (...args: any[]) => void;

export function debounce<T extends DebouncedFunction>(
  func: T, 
  wait: number, 
  immediate: boolean = false
): DebouncedFunction {
  let timeout: number| null = null;
  let args: any[] = [];
  let context: any;
  let timestamp: number;
  let result: any;

  const later = function() {
    const last = +new Date() - timestamp;

    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) {
          context = args = [];
        }
      }
    }
  };

  return function(this: any, ...args: any[]) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;

    if (!timeout) {
      timeout = setTimeout(later, wait);
    }

    if (callNow) {
      result = func.apply(context, args);
      context = args = [];
    }

    return result;
  };
}
