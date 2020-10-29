import produce from 'immer';
import { combineReducers } from 'redux';
import { GET_PROFILE, SELECTED_DATE, SHOPPING_LIST_DATES, FINANCE_DATES } from './actionTypes'
import { formatDate } from '../lib/formatDate';


const initialProfile = {
    userData: {
        attributes: {
            email: null
        }
    },
    jwtToken: null
};

const profile = (state = initialProfile, action) =>
    produce(state, draft => {
        switch (action.type) {
            case GET_PROFILE:
                draft.userData = action.payload.user;
                draft.jwtToken = action.payload.jwtToken;
                break;
            default:
                break;
        }
    });

const formattedDate = formatDate(new Date());

const initialDate = {
    date: formattedDate.date,
    month: formattedDate.month
};

const selectedDate = (state = initialDate, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SELECTED_DATE:
                draft.date = action.payload.date;
                draft.month = action.payload.month;
                break;
            default:
                break;
        }
    });

const initialDates = {
    dates: []
};

const shoppingListDates = (state = initialDates, action) =>
    produce(state, draft => {
        switch (action.type) {
            case SHOPPING_LIST_DATES:
                draft.dates = action.payload.dates;
                break;
            default:
                break;
        }
    });

const financeDates = (state = initialDates, action) =>
    produce(state, draft => {
        switch (action.type) {
            case FINANCE_DATES:
                draft.dates = action.payload.dates;
                break;
            default:
                break;
        }
    });

export default combineReducers({
    profile,
    selectedDate,
    shoppingListDates,
    financeDates
});