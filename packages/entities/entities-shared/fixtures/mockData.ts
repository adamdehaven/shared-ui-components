export const mockTableData = {
  total: 2,
  data: [
    {
      id: '08cc7d81-a9d8-4ae1-a42f-8d4e5a919d07',
      name: 'Route 1',
      protocols: ['http', 'https'],
      hosts: 'https://httpbin.org/',
      methods: ['POST'],
      paths: '/dogs',
    },
    {
      id: '22d28551-cc16-4429-8885-3b32d2fa7e0a',
      name: 'Route 2',
      protocols: ['ws'],
      hosts: 'https://httpbin.org/',
      methods: ['GET', 'PUT'],
      paths: '/cats',
    },
  ],
}

export const mockTableHeaders = {
  id: {
    label: 'ID',
    sortable: true,
  },
  name: {
    label: 'Name',
    sortable: true,
  },
  protocols: {
    label: 'Protocols',
    sortable: false,
  },
  hosts: {
    label: 'Hosts',
    sortable: true,
  },
  methods: {
    label: 'Methods',
    sortable: false,
  },
  paths: {
    label: 'Paths',
    sortable: false,
  },
}

export const mockExactMatchFilterConfig = {
  isExactMatch: true,
  placeholder: 'Filter by exact name or ID',
}

export const mockFuzzyMatchFilterConfig = {
  isExactMatch: false,
  fields: {
    name: {
      label: 'Name',
      searchable: true,
    },
    protocols: {
      label: 'Protocols',
      searchable: true,
    },
    methods: {
      label: 'Methods',
      searchable: true,
    },
    port: {
      label: 'Port',
      searchable: true,
    },
    paths: {
      label: 'Paths',
      searchable: true,
    },
    // To hide certain fields in the filter, set their `searchable` to `false
    tags: {
      label: 'Tags',
      searchable: false,
    },
  },
  schema: {
    protocols: {
      type: 'select',
      values: ['http', 'https', 'tcp', 'tls', 'grpc', 'grpcs'],
    },
    port: {
      type: 'number',
    },
  },
}
