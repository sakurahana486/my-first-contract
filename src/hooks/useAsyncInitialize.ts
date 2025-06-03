//你不必知道这里发生的一切，但创建它主要是为了：一旦我们初始化了 async对象，就能将它用作钩子。

import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: any[] = []
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      setState(await func());
    })();
  }, deps);

  return state;
}
