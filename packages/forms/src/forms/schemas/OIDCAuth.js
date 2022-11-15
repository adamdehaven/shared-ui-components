export default {
  fields: [{
    help: 'The claim that contains the scopes.',
    inputType: 'text',
    label: 'Config [scopes_claim]',
    model: 'config-scopes_claim',
    type: 'input',
  }, {
    help: 'The scopes required to be in the access token.',
    inputType: 'text',
    label: 'Config [scopes_required]',
    model: 'config-scopes_required',
    type: 'input',
  }, {
    help: 'The claim that contains the audience.',
    inputType: 'text',
    label: 'Config [audience_claim]',
    model: 'config-audience_claim',
    type: 'input',
  }, {
    help: 'The audience required to be in the access token.',
    inputType: 'text',
    label: 'Config [audience_required]',
    model: 'config-audience_required',
    type: 'input',
  }, {
    help: 'The claim that contains the roles.',
    inputType: 'text',
    label: 'Config [roles_claim]',
    model: 'config-roles_claim',
    type: 'input',
  }, {
    help: 'The roles required to be in the access token.',
    inputType: 'text',
    label: 'Config [roles_required]',
    model: 'config-roles_required',
    type: 'input',
  }, {
    help: 'The claim that contains the groups.',
    inputType: 'text',
    label: 'Config.Groups Claim',
    model: 'config-groups_claim',
    type: 'array',
    valueType: 'string',
    valueArrayType: 'array',
    itemContainerComponent: 'FieldArrayItem',
    fieldClasses: 'w-100',
    fieldItemsClasses: 'd-flex mt-2 w-90',
    inputAttributes: { class: 'k-input', style: { minWidth: '200px' } },
    validator: 'array',
    styleClasses: 'w-100',
    newElementButtonLabel: '+ Add',
  }, {
    help: 'The groups required to be in the access token.',
    inputType: 'text',
    label: 'Config.Groups Required',
    model: 'config-groups_required',
    type: 'array',
    valueType: 'string',
    valueArrayType: 'array',
    itemContainerComponent: 'FieldArrayItem',
    fieldClasses: 'w-100',
    fieldItemsClasses: 'd-flex mt-2 w-90',
    inputAttributes: { class: 'k-input', style: { minWidth: '200px' } },
    validator: 'array',
    styleClasses: 'w-100',
    newElementButtonLabel: '+ Add',
  }, {
    help: 'The claim that contains authenticated groups.',
    inputType: 'text',
    label: 'Config.Authenticated Groups claim',
    model: 'config-authenticated_groups_claim',
    type: 'array',
    valueType: 'string',
    valueArrayType: 'array',
    itemContainerComponent: 'FieldArrayItem',
    fieldClasses: 'w-100',
    fieldItemsClasses: 'd-flex mt-2 w-90',
    inputAttributes: { class: 'k-input', style: { minWidth: '200px' } },
    validator: 'array',
    styleClasses: 'w-100',
    newElementButtonLabel: '+ Add',
  }],
}
