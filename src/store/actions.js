import { GET_PROFILE, SELECTED_DATE, SHOPPING_LIST_DATES, FINANCE_DATES } from './actionTypes'

export const getProfile = payload => {
  return {
    type: GET_PROFILE,
    payload,
  }
};

export const selectDate = payload => {
  return {
    type: SELECTED_DATE,
    payload,
  }
};

export const shoppingListDates = payload => {
  return {
    type: SHOPPING_LIST_DATES,
    payload
  }
};

export const financeDates = payload => {
  return {
    type: FINANCE_DATES,
    payload
  }
};