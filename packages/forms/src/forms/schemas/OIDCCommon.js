export default {
  fields: [{
    help: 'The client id(s) that the plugin uses when it calls authenticated endpoints on the identity provider.',
    inputType: 'text',
    label: 'Client ID - Config [client_id]',
    model: 'config-client_id',
    type: 'input',
  }, {
    help: 'The client secret.',
    inputType: 'text',
    label: 'Client Secret - Config [client_secret]',
    model: 'config-client_secret',
    type: 'input',
  }, {
    help: 'The discovery endpoint (or just the issuer identifier).',
    inputType: 'text',
    label: 'Issuer (Discovery Document URI) - Config [issuer]',
    model: 'config-issuer',
    required: true,
    type: 'input',
  }, {
    help: 'Types of credentials/grants to enable.',
    inputType: 'text',
    label: 'Config.Auth Methods',
    model: 'config-auth_methods',
    type: 'input',
  }],
}
