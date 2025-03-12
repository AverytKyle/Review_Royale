const LOAD_USER = 'users/LOAD_USER';

const loadUser = (user) => ({
    type: LOAD_USER,
    user
});

export const getUser = (userId) => async dispatch => {
    const response = await fetch(`/api/users/${userId}`);
    if (response.ok) {
        const user = await response.json();
        dispatch(loadUser(user));
        return user;
    }
};

const initialState = {};

export default function usersReducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_USER:
            return { ...state, [action.user.id]: action.user };
        default:
            return state;
    }
}