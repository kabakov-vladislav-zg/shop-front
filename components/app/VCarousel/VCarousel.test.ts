import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VCarousel from './VCarousel.vue'

describe('VCarousel', async () => {
  it('is a Vue instance', () => {
    const wrapper = mount(VCarousel)
    expect(wrapper.vm).toBeTruthy()
  })
})