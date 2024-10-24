import { mount } from '@vue/test-utils'
import HomePage from '../../src/views/ConsultationPage.vue'
import { describe, expect, test } from 'vitest'

describe('ConsultationPage.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
