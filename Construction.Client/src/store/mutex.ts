/**
 * Minimal async mutex.
 *
 * Used to serialise token refresh: when several requests fail with 401 at once, only the first
 * exchanges the refresh token and the rest wait for it, rather than each firing its own refresh
 * and invalidating one another through rotation.
 */
export class Mutex {
  private locked = false;
  private waiters: Array<() => void> = [];

  isLocked(): boolean {
    return this.locked;
  }

  /** Acquires the lock, returning a function that releases it. */
  async acquire(): Promise<() => void> {
    while (this.locked) {
      await this.waitForUnlock();
    }

    this.locked = true;
    let released = false;

    return () => {
      if (released) return;
      released = true;
      this.locked = false;
      const waiters = this.waiters;
      this.waiters = [];
      waiters.forEach((resolve) => resolve());
    };
  }

  /** Resolves once the lock is free. */
  waitForUnlock(): Promise<void> {
    if (!this.locked) return Promise.resolve();
    return new Promise<void>((resolve) => {
      this.waiters.push(resolve);
    });
  }
}
