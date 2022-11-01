export interface SidebarSecondaryItem {
  /** The display text of the sidebar item */
  name: string
  /** The [Vue Router `to` object](https://router.vuejs.org/api/interfaces/RouterLinkProps.html#to) or a URL path (relative or absolute) to navigate to on click */
  to: string | Record<string, any>
  /** Set external to true if you want to navigate via anchor tag instead of a router-link. If the `to` property is a string that starts with `http*` it will open in a new window */
  external?: boolean
  /** Is the sidebar item active */
  active?: boolean
  /** Number to display in a badge to the right of the name */
  badgeCount?: number
  /** The data-testid attribute to apply to the sidebar item */
  testId?: string
  /** Auto-generated (do not provide yourself) unique key of the secondary item's top-level navigation parent item */
  parentKey?: string
}

export interface SidebarPrimaryItem extends Omit<SidebarSecondaryItem, 'parentKey' | 'badgeCount'> {
  /** Unique key of top-level navigation item */
  key: string
  /** Label to show under the name when the item is expanded */
  label?: string
  /** Is the top-level sidebar item expanded */
  expanded?: boolean
  /** The name of the [Kongponent KIcon](https://beta.kongponents.konghq.com/components/icon.html#icon-1) to display next to the top-level item name */
  icon?: string
  /** Nested sidebar items (children) without icons */
  items?: SidebarSecondaryItem[]
}

export interface SidebarProfileItem extends Omit<SidebarPrimaryItem, 'key' | 'expanded' | 'active' | 'icon' | 'items'> {}
