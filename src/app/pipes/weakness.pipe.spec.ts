import { WeaknessPipe } from './weakness.pipe';

describe('WeaknessPipe', () => {
  it('create an instance', () => {
    const pipe = new WeaknessPipe();
    expect(pipe).toBeTruthy();
  });
});
