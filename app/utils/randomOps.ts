export function xorshift32(seed: number) {
  let x = seed >>> 0 || 123456789;
  return function next() {
    x ^= x << 13;
    x = x >>> 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x = x >>> 0;
    return (x >>> 0) / 0xffffffff;
  };
}

// Simple deterministic RNG (reuse your xorshift32 if you want)
export function randGen(seed: number) {
  let x = seed >>> 0 || 123456789;
  return function next() {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x >>>= 0;
    x ^= x << 5;
    return (x >>> 0) / 0xffffffff;
  };
}
