import { mount, shallowMount } from '@vue/test-utils'
import FieldObjectAdvanced from '@/plugins/vfg/FieldObjectAdvanced'
import { setupVue } from '../vtu-helpers'

const schema = {
  type: 'object-advanced',
  model: 'config-limits',
}

describe('FieldObjectAdvanced', () => {
  describe('transformMapModelValuesToObject', () => {
    it('simple string field model', async () => {
      const wrapper = shallowMount(FieldObjectAdvanced, setupVue({
        props: {
          model: {
            'config-limits-header1': 'X-Gruce-Auth',
            'config-limits-header-2': 'X-Gruce-Limit',
          },
          schema,
        },
      }))

      const { vm } = wrapper

      expect(vm.transformMapModelValuesToObject(vm.model, [], vm.schema.model))
        .to.eql({ header1: 'X-Gruce-Auth', 'header-2': 'X-Gruce-Limit' })
    })

    it('handles sub schema', async () => {
      const wrapper = shallowMount(FieldObjectAdvanced, setupVue({
        props: {
          model: {
            'config-limits-consumer1-second': '10',
            'config-limits-consumer1-hour': '300',
            'config-limits-consumer-with-hyphens-hour': '1',
          },
          schema: {
            ...schema,
            schema: {
              fields: [
                {
                  type: 'object',
                  model: 'object',
                  schema: {
                    fields:
                    [
                      { model: 'second', type: 'input', inputType: 'number' },
                      { model: 'hour', type: 'input', inputType: 'number' },
                    ],
                  },
                }],
            },
          },
        },
      }))

      const { vm } = wrapper

      expect(vm.transformMapModelValuesToObject(vm.model, vm.subSchema.fields, vm.schema.model))
        .to.eql({ consumer1: { second: '10', hour: '300' }, 'consumer-with-hyphens': { hour: '1' } })
    })
  })

  describe('handles hardcoded schema', () => {
    it('renders field correctly', () => {
      const wrapper = mount(FieldObjectAdvanced, setupVue({
        props: {
          model: {
            headers: {},
          },
          schema: {
            headers: {
              label: 'Headers',
              type: 'object-advanced',
              placeholder: 'Enter header name',
              fields: [{
                schema: {
                  type: 'input',
                  inputType: 'text',
                  valueType: 'array',
                  placeholder: 'Comma separated list of header values',
                },
              }],
            },
          },
        },
      }))

      expect(wrapper.find('input[data-testid="keyname-input"]').exists()).toBe(true)
      expect(wrapper.find('button[data-testid="add-key"]').exists()).toBe(true)
    })
  })
})
