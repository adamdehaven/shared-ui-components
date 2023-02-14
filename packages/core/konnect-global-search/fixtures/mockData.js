const searchEntities = ['service_packages', 'service_versions', 'developers', 'users', 'service_package_documents', 'service_version_documents']

const portalData = {
  created_at: '2022-04-08T13:39:39.563Z',
  updated_at: '2022-05-04T18:34:34.836Z',
  id: '03916566-0dd0-4815-9587-8d1603f89707',
  name: 'default',
  uri: 'nixorg188dc35f',
  custom_domain: null,
  is_domain_verified: false,
  theme_name: 'custom',
  use_custom_fonts: true,
  fonts: { base: 'Source Sans Pro', code: 'Source Code Pro', headings: 'PT Mono' },
  colors: {
    section_colors: {
      header: {
        value: '#0A161E',
        description: 'Background for header',
      },
      body: {
        value: '#1A1D21',
        description: 'Background for main content',
      },
      hero: {
        value: '#1A1D21',
        description: 'Background for hero section',
      },
      accent: {
        value: '#1F1F1F',
        description: 'Subtle background',
      },
      tertiary: { value: '#222529', description: 'Tertiary background' },
      stroke: { value: '#34393F', description: 'Border color' },
      footer: { value: '#212429', description: 'Background for footer' },
    },
    text_colors: {
      header: {
        value: '#911ED0',
        description: 'Header text',
      },
      hero: { value: '#52BBFF', description: 'Hero text' },
      headings: { value: '#8539E6', description: 'Headings text' },
      primary: { value: '#6C6CFF', description: 'Main content text' },
      secondary: { value: '#B762FF', description: 'Supporting text' },
      accent: { value: '#ACB5FF', description: 'Subtle text' },
      link: { value: '#1155CB', description: 'Link text' },
      footer: { value: '#FFFFFF', description: 'Footer text' },
    },
    button_colors: {
      'primary-fill': {
        value: '#6C6CFF',
        description: 'Background for Primary Button',
      },
      'primary-text': { value: '#FFFFFF', description: 'Text for Primary Button' },
    },
  },
  logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAApBAMAAACCbnuKAAAAG1BMVEUAAAD///9/f3+/v78fHx8/Pz+fn59fX1/f399wXrBlAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABIUlEQVRYhe2UsQuCQBSHH3qla6C0CkE0BkE0KjQ0KjU0FlE46taoEtifnV7elS8r6F7b/eBQP+F9J+95ADo6OjpPYf7n98tm/ZIRr70G6O+6ucipWb9kz2unLxLJKSSx2xSzkm5OITlMULF3XElie90SzJUkltMtwVxJAnMQjWfD6naVtHndm3oo1CRBKKcr9QFmiNNIjExK+lOwLojTSKCQElbw/bc4kSTy5c8YhXPMiSTmVEqMIsOcSMLcx7GSh5gTSWAiJSxPMKeS2J6QmEcHcypJzxGSM39u8VpiEkhgJkbYBX5kPfOyugYUkmB/l1Q77rmIV4XZgkJiDO6S+niPEY882I4pJJBzCf8Ke9fmVn4tVRv/PWzzt9I6Ojp/yQ2gDVV8Nxza5AAAAABJRU5ErkJggg==',
  logo_filename: 'nix-logo.png',
  favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFOElEQVRYhe2WW2gUZxTHfzsze7+4MZcZN80SdVc0JDWyGAJaqdiQaFsj5qGCqIUifWofCvaiT6UaVCxYqkQR+lKQxiClVBSVFkRjvQVqq4lEbYqXuLvJrpvsbmbNzGb6sLsxiVFbX5s/fDBzvvM/5/+d7wozmMH/HaYXddbX168fHh7eqGnaKyd4/Pgxg4ODHwH9/0nAkiVLVrjd7p8a36zxLq8uf7XsxhgbP/6acCz5l67rISAx1UV6HjedTtvqQkHvJ+8uxmYy4H49xIP/Pvn80+CK8mPrFpZ+sF8B6oAzU92EF8UQBQObaIIHdRCtBt3+tCWy0H4y9/1gCDr/mNzf+w6MFOOwii/U+dwKjOPhUogshs5OkGUIBHJ2lwtaWgAYcIrcUySUxEPKveWQzYIgQk8LgrkXQPB6vQvKysoGAaLR6GAikbj30gpMwrJlT5NPQDKT5NClQ2w4toF95/ZxL34Prl6FeBwAWS7DYrHYFEX5NhAIdFmt1q5EItEGeP+bgKmIRADojfRyNnKWbdu2YQQN9nTu4e+gAsXFAFgsVgAWLVpES0sLiqIAlAEeAKmurm59IpFYaBgGALFYTI/H43tfKqCvLzclE1BVVUU33Rz47QBFQhEAY6V/snr1apqamtB1nWw2O4kjpVKpjStWrFjvcDjQNI3Dhw+PVVZWrnI4HC6PZxbkhQFw9y74fGC3Q339tLqqqqq4mr7KnYE7AIhxkTVr1oz322w2zGbza8ByTdOOiqIovtfX17eosbERWZYJBAKmQCAwv6urq8Lnllj7egOk5uTY6TQ4nSBJ8OQJkYu/sP/OD1QsrqC0tHQ8SXl5OcFgkGAwSGDKuvF4PPT397ui0WgxcEoKh8Nf2e322tbW1nmjo6MIgkAgECAUChGP3X86cocDKiqeRhIE4qLGiVsn2NGyA4BgMMj58+dRVZW5c+eOu1osFmpra9m+fTvr1q2jpKQEwAZIAvC7qqrN8Xh8ZyqV2qmq6nc9PT2cOXMmt5VysnMCJsJshnnzJ5na29tpa2tjZGRk3LZ3716GhobYtGkTjx49embKCufAjXxD0zSbpmmnXS7X6lJ/xfsIAkwoLwAnTkBDw/jvPCAEVC5YQNnWrRTnd4CmaWzevBmLxUJzczML3W7eBnqAC4VCPiMJMsAxn8/XLpnNoFyH4ltw5Upu5QOsXAkWC6Ig4rF60DMZbIDX5eLatWvcvHmTZDLJ7t27cTqdDAwM0NbWRnFREaZMBjWZfKYC46ipqfGPjo5itVpLNC3LkDrErIqL0FgLw0UgJsECkGJBxRyObjnMpz/voGfNWpxOJ3a7nePHj4/Ha21tBcDr9dKrquzq6KDz+vVRYASmuQ1DoZDhdrsxm81ks1lqZBMfrn8DADWTIRqJAsYkzqlLvVx5kKWpqQlN0wiHwzidTmbPng3A4OAg6XSa7u5uLl++nAEuAd8Avz5T/+rqaqOjo8M4ePCg0dDQYABGUVGR4ff7DbPZbAAx4OHEZjKZHiuKYvj9fsNmsxnAkCRJTyorKw1Zlg0gO8H/HLCWwkk4VUAqleLIkSP09fVx+/btEUEQ9JKSEo8sy8RiMTRNOwm0AWMFjs/na5Zl+XOHw0EymSSTyVxQFGWe3+9fmEgkiEQiGeALoDdPuQUMTzsFoih+n81mC6dHWJKkLl3XV5HbtwAXgc8AvcCx2+31qqp+WRgVcEOSpH5d198it9BHgV1M8x6Y7kXkIH9T5RHPBy5UawwIT8MrIb888z7xvK2AFPlRz2AGM5iIfwCWUecTSmQ3iwAAAABJRU5ErkJggg==',
  catalog_cover: null,
  custom_catalog: { welcome_message: 'Foos and Bars welcome!', primary_header: 'Be a NINJA dev' },
  favicon_filename: 'nyancat32x32.png',
  is_public: false,
  auto_approve_developers: false,
  auto_approve_applications: false,
  rbac_enabled: false,
}

const serviceId = '3dcc535b-7b40-4ecd-a954-66080930838b'
const servicePackage1 = {
  index: 'service_packages',
  source: {
    created_at: '2022-05-10T16:27:08.172Z',
    updated_at: '2023-01-23T17:06:35.240Z',
    id: serviceId,
    name: 'a-good-one',
    display_name: 'a good one again',
    description: 'test description2',
    labels: { foo: 'bar', fooz: 'baaaaaaaar', test: 'foo', fooze: 'ballllllllllll', foooooooood: 'baaaaaaaar' },
    label: 'a-good-one',
  },
  label: 'a-good-one',
  value: serviceId,
}

const servicePackage = {
  index: 'service_packages',
  source: {
    created_at: '2022-04-08T13:44:09.344Z',
    updated_at: '2022-07-27T16:33:51.400Z',
    id: '6b3bc089-441c-456a-9b02-97a44b7b29b8',
    name: 'fooAPIxxx-x',
    display_name: 'fooAPIxxx xx',
    description: 'bar like a boss!',
    labels: { foo: 'bar', waaaahhhh: 'ooooooooooo', woooooooooooo: 'oooooooooooot', 'and-another-one': 'bites-the-dust' },
    label: 'fooAPIxxx-x',
  },
  label: 'fooAPIxxx-x',
  value: '6b3bc089-441c-456a-9b02-97a44b7b29b8',
}

const serviceVersion1 = {
  index: 'service_versions',
  source: {
    created_at: '2022-05-23T21:53:53.189Z',
    updated_at: '2022-11-22T15:48:21.619Z',
    id: 'f332fd04-fa7a-43e0-86dc-49ff19eed74e',
    version: 'testvvvv',
    publish_status: 'published',
    deprecated: false,
    tracking_id: 'ba7e1752-7644-4eda-a223-c880f874424e',
    service_package: {
      created_at: '2022-05-10T16:27:08.172Z',
      updated_at: '2023-01-23T17:06:35.240Z',
      id: serviceId,
      name: 'a-good-one',
      display_name: 'a good one again',
      description: 'test description2',
      labels: { foo: 'bar', fooz: 'baaaaaaaar', test: 'foo', fooze: 'ballllllllllll', foooooooood: 'baaaaaaaar' },
    },
  },
  label: 'testvvvv',
  value: 'f332fd04-fa7a-43e0-86dc-49ff19eed74e',
}

const serviceVersion = {
  index: 'service_versions',
  source: {
    created_at: '2022-05-10T16:27:14.033Z',
    updated_at: '2022-10-20T20:24:30.282Z',
    id: 'c8dfc706-6b0f-4cee-a71a-d3ef77af33b3',
    version: 'v1',
    publish_status: 'published',
    deprecated: false,
    tracking_id: '8d640dcc-c0e4-4273-a8cf-267050bef5b2',
    service_package: {
      created_at: '2022-05-10T16:27:08.172Z',
      updated_at: '2023-01-23T17:06:35.240Z',
      id: serviceId,
      name: 'a-good-one',
      display_name: 'a good one again',
      description: 'test description2',
      labels: { foo: 'bar', fooz: 'baaaaaaaar', test: 'foo', fooze: 'ballllllllllll', foooooooood: 'baaaaaaaar' },
    },
  },
  label: 'v1',
  value: 'c8dfc706-6b0f-4cee-a71a-d3ef77af33b3',
}

const developer = {
  index: 'developers',
  source: {
    created_at: '2022-04-08T13:55:15.245Z',
    updated_at: '2022-09-23T00:00:23.656Z',
    id: 'b426ae39-18e9-470a-938c-48d256b254a8',
    email: 'tk.meowstersmith@gmail.com',
    status: 'approved',
    full_name: 'TK Meowstersmith',
    credential_migration_email_sent_at: '2022-09-23T00:00:23.658Z',
    portal: portalData,
    label: 'TK Meowstersmith',
    name: 'TK Meowstersmith',
  },
  label: 'tk.meowstersmith@gmail.com',
  value: 'b426ae39-18e9-470a-938c-48d256b254a8',
}

const user = {
  index: 'users',
  source: {
    id: 'b2551f2e-4a18-4047-a7aa-04c4260cd36e',
    full_name: 'Nix Cipher',
    email: 'nix-cipher@null.net',
    active: true,
    owner: true,
    preferred_name: '',
    label: 'Nix Cipher',
    name: 'Nix Cipher',
  },
  label: 'nix-cipher@null.net',
  value: 'b2551f2e-4a18-4047-a7aa-04c4260cd36e',
}

const serviceDoc = {
  index: 'service_package_documents',
  source: {
    created_at: '2022-04-08T14:20:11.765Z',
    updated_at: '2022-04-08T14:20:11.765Z',
    id: '20e6dd52-5010-47a5-bd7c-e5b6ba8d500e',
    path: '/test.md',
    content: "# KHCP\r\n\r\n[![Build Status](https://jenkins.dev.khcp.kongcloud.io/buildStatus/icon?job=khcp%2Fmaster)](https://jenkins.dev.khcp.kongcloud.io/job/khcp/job/master/)\r\n\r\n## Description\r\n\r\nKong Hybrid Cloud Platform monorepo.\r\n\r\n* [Documentation](https://docs-khcp.netlify.com/) [![Netlify Status](https://api.netlify.com/api/v1/badges/295998c1-7d4d-4170-ae4e-f52a8e59cdd4/deploy-status)](https://app.netlify.com/sites/docs-khcp/deploys)\r\n  * Credentials stored in 1Password\r\n  * Don't have access? Browse the [source](https://github.com/Kong/khcp/tree/master/docs)\r\n    - [Getting Started](https://github.com/Kong/khcp/tree/master/docs/getting-started.md)\r\n\r\n",
    published: true,
    service_package: {
      created_at: '2022-04-08T14:18:36.880Z',
      updated_at: '2022-04-08T15:11:58.524Z',
      id: '328cdcb9-ab1f-482b-b628-76280c47cc8c',
      name: 'rrrrrrrraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      display_name: 'rrrrrrrraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      description: "I AM A TYRANASAUROUS REX FEAR ME ALL CREATURES FOR I WILL EAT YOU AND YOU WILL TASTE GOOD JUST DO NOT GO ANYWHERE I CANNOT FIT MY HEAD BECAUSE MY TINY LITTLE ARMS WILL NOT BE ABLE TO REACH YOU!!!!!!! Please don't do that or I might cry, okay?",
      labels: {},
    },
  },
  label: '/test.md',
  value: '20e6dd52-5010-47a5-bd7c-e5b6ba8d500e',
}

const versionDoc = {
  index: 'service_version_documents',
  source: {
    created_at: '2022-11-10T21:55:40.371Z',
    updated_at: '2022-11-10T21:55:40.371Z',
    id: '9e258fa9-8a5a-4b34-9a63-7c4798bdc799',
    path: '/petstore.json',
    content: '{\r\n  "swagger": "2.0",\r\n  "info": {\r\n    "version": "1.0.0",\r\n    "title": "Swagger Petstore",\r\n    "license": {\r\n      "name": "MIT"\r\n    },\r\n    "description": "This comes from the spec."\r\n  },\r\n  "host": "petstore.swagger.io",\r\n  "basePath": "/v1",\r\n  "schemes": [\r\n    "http"\r\n  ],\r\n  "consumes": [\r\n    "application/json"\r\n  ],\r\n  "produces": [\r\n    "application/json"\r\n  ],\r\n  "paths": {\r\n    "/pets": {\r\n      "get": {\r\n        "summary": "List all pets",\r\n        "operationId": "listPets",\r\n        "tags": [\r\n          "pets"\r\n        ],\r\n        "parameters": [\r\n          {\r\n            "name": "limit",\r\n            "in": "query",\r\n            "description": "How many items to return at one time (max 100)",\r\n            "required": false,\r\n            "type": "integer",\r\n            "format": "int32"\r\n          }\r\n        ],\r\n        "responses": {\r\n          "200": {\r\n            "description": "An paged array of pets",\r\n            "headers": {\r\n              "x-next": {\r\n                "type": "string",\r\n                "description": "A link to the next page of responses"\r\n              }\r\n            },\r\n            "schema": {\r\n              "$ref": "#/definitions/Pets"\r\n            }\r\n          },\r\n          "default": {\r\n            "description": "unexpected error",\r\n            "schema": {\r\n              "$ref": "#/definitions/Error"\r\n            }\r\n          }\r\n        }\r\n      },\r\n      "post": {\r\n        "summary": "Create a pet",\r\n        "operationId": "createPets",\r\n        "tags": [\r\n          "pets"\r\n        ],\r\n        "responses": {\r\n          "201": {\r\n            "description": "Null response"\r\n          },\r\n          "default": {\r\n            "description": "unexpected error",\r\n            "schema": {\r\n              "$ref": "#/definitions/Error"\r\n            }\r\n          }\r\n        }\r\n      }\r\n    },\r\n    "/pets/{petId}": {\r\n      "get": {\r\n        "summary": "Info for a specific pet",\r\n        "operationId": "showPetById",\r\n        "tags": [\r\n          "pets"\r\n        ],\r\n        "parameters": [\r\n          {\r\n            "name": "petId",\r\n            "in": "path",\r\n            "required": true,\r\n            "description": "The id of the pet to retrieve",\r\n            "type": "string"\r\n          }\r\n        ],\r\n        "responses": {\r\n          "200": {\r\n            "description": "Expected response to a valid request",\r\n            "schema": {\r\n              "$ref": "#/definitions/Pets"\r\n            }\r\n          },\r\n          "default": {\r\n            "description": "unexpected error",\r\n            "schema": {\r\n              "$ref": "#/definitions/Error"\r\n            }\r\n          }\r\n        }\r\n      }\r\n    }\r\n  },\r\n  "definitions": {\r\n    "Pet": {\r\n      "required": [\r\n        "id",\r\n        "name"\r\n      ],\r\n      "properties": {\r\n        "id": {\r\n          "type": "integer",\r\n          "format": "int64"\r\n        },\r\n        "name": {\r\n          "type": "string"\r\n        },\r\n        "tag": {\r\n          "type": "string"\r\n        }\r\n      }\r\n    },\r\n    "Pets": {\r\n      "type": "array",\r\n      "items": {\r\n        "$ref": "#/definitions/Pet"\r\n      }\r\n    },\r\n    "Error": {\r\n      "required": [\r\n        "code",\r\n        "message"\r\n      ],\r\n      "properties": {\r\n        "code": {\r\n          "type": "integer",\r\n          "format": "int32"\r\n        },\r\n        "message": {\r\n          "type": "string"\r\n        }\r\n      }\r\n    }\r\n  }\r\n}\r\n',
    published: true,
    service_version: {
      created_at: '2022-11-10T21:53:24.945Z',
      updated_at: '2022-11-10T21:53:24.945Z',
      id: 'fbe31b8b-dcf0-4fc1-8b54-b7191a44c723',
      version: 'v1',
      publish_status: 'published',
      deprecated: false,
      tracking_id: '9b7be1b0-a7e2-457c-a6a6-19ab59094b4d',
      control_plane: {
        created_at: '2022-11-10T21:52:13.772Z',
        updated_at: '2022-11-30T16:23:09.509Z',
        id: '37e3c5f2-ba37-4a45-bfe4-78815e91681d',
        name: 'onboarding-runtime-group',
        description: 'onboarding FTW!',
        config: { koko_cluster_dns_prefix: '5e560755a4' },
        labels: {},
        org_id: '5c684703-e108-4022-b92f-411d03444de2',
      },
      service_package: {
        created_at: '2022-11-10T21:53:24.470Z',
        updated_at: '2022-11-10T21:53:24.470Z',
        id: 'e05d897a-32e9-495f-884b-fecf06d0e5c7',
        name: 'onward',
        display_name: 'onward',
        description: "let's go!!",
        labels: {},
      },
    },
  },
  label: '/petstore.json',
  value: '9e258fa9-8a5a-4b34-9a63-7c4798bdc799',
}

const searchData = {
  data: [
    servicePackage1,
    servicePackage,
    serviceVersion1,
    serviceVersion,
    {
      index: 'developers',
      source: {
        created_at: '2022-05-13T16:40:39.479Z',
        updated_at: '2022-05-18T17:52:33.630Z',
        id: 'c3670bb7-99f7-4943-8914-59311788d959',
        email: 'nix-cipher@null.net',
        status: 'revoked',
        full_name: 'Nix Null',
        credential_migration_email_sent_at: null,
        portal: portalData,
        label: 'Nix Null',
        name: 'Nix Null',
      },
      label: 'nix-cipher@null.net',
      value: 'c3670bb7-99f7-4943-8914-59311788d959',
    },
    developer,
    {
      index: 'users',
      source: {
        id: '54b30807-2cfe-4b96-9b73-29d267f2444a',
        full_name: 'Koder Kai',
        email: 'koder_kai@tehkai.net',
        active: true,
        owner: false,
        preferred_name: '',
        label: 'Koder Kai',
        name: 'Koder Kai',
      },
      label: 'koder_kai@tehkai.net',
      value: '54b30807-2cfe-4b96-9b73-29d267f2444a',
    },
    user,
    serviceDoc,
    versionDoc,
  ],
}

export {
  searchEntities,
  searchData,
  serviceId,
  servicePackage1,
  servicePackage,
  serviceVersion1,
  serviceVersion,
  developer,
  user,
  serviceDoc,
  versionDoc,
}
