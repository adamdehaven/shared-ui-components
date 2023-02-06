import { ref } from 'vue'
import axios from 'axios'
import type { SearchResultsResponse } from '../types'

// Initialize the config ref outside the function for persistence
const results = ref<SearchResultsResponse>()

export default function useSearchApi(baseUrl: string) {
  const error = ref<Error>()

  const fetchSearchResults = async (searchFilter: string, searchQuery: string): Promise<void> => {
    try {
      // Fetch the config
      const { data }: { data: SearchResultsResponse } = await axios.get(`${baseUrl}/api/search${searchFilter ? '/' + searchFilter : ''}?q=${searchQuery}`, {
        withCredentials: true,
        timeout: 10000,
      })

      // If expected data is missing, throw an error
      if (!data?.data) {
        throw new Error('Could not fetch url')
      }

      // Store the config data
      results.value = data
      error.value = undefined
    } catch (err: any) {
      results.value = undefined
      error.value = err
    }
  }

  return {
    results,
    error,
    fetchSearchResults,
  }
}
