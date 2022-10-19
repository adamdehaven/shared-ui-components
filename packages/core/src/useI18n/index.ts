// Important: do not utilize Vue reactive variables in this composable so that it may be used outside the setup() function
import flatten from 'flat'

export default function useI18n(messages: Record<string, string>) {
  const flattenedMessages: any = flatten(messages, {
    safe: true, // Preserve arrays
  })

  const t = (translationKey: string) => {
    return flattenedMessages[translationKey]
  }

  return {
    t,
    // TODO: I'm not sure this is needed; we likely shouldn't be exporting the flattened messages object but rather should make devs interact through the provided methods (e.g. `t`)
    messages: flatten(messages),
  }
}
