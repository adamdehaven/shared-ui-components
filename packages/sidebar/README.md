# @kong-ui/sidebar

> **NOTE**: Docs are a work-in-progress

## Notes

- Document that subnav links with required route params must be declared. Example:

  ```ts
  // Note: `currentRoute` equates to router.currentRoute and must be passed in to the consuming app's route generator
  {
    name: 'Runtime Instances',
    to: {
      name: 'runtime-instances',
      params: {
        control_plane_id: currentRoute?.params.control_plane_id
      }
    }
  }
  ```


- Be sure to list required Kongponents that must be globally available
- List `badgeCount` info/specs
