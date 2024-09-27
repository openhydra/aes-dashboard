export default function (fetchPromise: any, timeout: number | undefined) {
  let abortFn: () => void;

  // 这是一个可以被reject的promise
  const abortPromise = new Promise(function (resolve, reject) {
    abortFn = function () {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('abort promise');
    };
  });

  // 这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
  const abortablePromise = Promise.race([fetchPromise, abortPromise]);

  setTimeout(function () {
    abortFn();
  }, timeout);

  return abortablePromise;
}
