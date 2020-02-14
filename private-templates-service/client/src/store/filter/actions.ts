import { CLEAR_FILTER, FilterAction, QUERY_FILTER } from './types';

export function queryFilter(filterType: string): FilterAction {
  return {
    type: QUERY_FILTER,
    text: "User has selected one of the filter options to query",
    filterType: filterType
    //TODO: Use thunk to get templates 
  }
}

export function clearFilter(): FilterAction {
  return {
    type: CLEAR_FILTER,
    text: "User has cleared the filter paramaters",
    filterType: ""
  }
}