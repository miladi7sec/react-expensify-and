import uuid from 'uuid';
import database from '../firebase/firebase';


// SET_EXPENSES
export const setExpenses = (expenses) => ({
  type: 'SET_EXPENSES',
  expenses
})

export const  startSetExpenses = () => {
  return (dispatch, getStore) => {
    const uid = getStore().auth.uid;
    return database.ref(`users/${uid}/expenses`).once('value').then((snapshots)=> {
      const expenses= [];
      snapshots.forEach((expense) => {
        expenses.push({
          id: expense.key,
          ...expense.val()
        })
      })
      dispatch(setExpenses(expenses));
    })
    
  }
}
// ADD_EXPENSE

export const addExpense = (expense) => ({
  type: 'ADD_EXPENSE',
  expense
});

export const startAddExpense = (expenseData = {}) => {
  return (dispatch, getStore) => {
    const uid = getStore().auth.uid;
    const { description ='', note='', amount=0, createdAt=0 } = expenseData;
    const expense ={description, note, amount, createdAt };
    // the following return is added only to allow the associated test to work 
    // correctly, but you can remove the return and the app is going to continue
    // working correctly
    return database.ref(`users/${uid}/expenses`).push(expense).then((ref)=> {
      dispatch(addExpense({id: ref.key, ...expense}));
    });
  }
}


// REMOVE_EXPENSE
export const removeExpense = ({ id } = {}) => ({
  type: 'REMOVE_EXPENSE',
  id
});

export const startRemoveExpense = ({id} ={}) => {
  return (dispatch, getStore) => {
    const uid = getStore().auth.uid;
    return database.ref(`users/${uid}/expenses/${id}`).remove().then(()=> {
      dispatch(removeExpense({id}))
    });
    
  }
}
// EDIT_EXPENSE
export const editExpense = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
});

export const startEditExpense = (id, updates) => {
  return (dispatch, getStore) => {
    const uid = getStore().auth.uid;
    return database.ref(`users/${uid}/expenses/${id}`).update(updates).then(() => {
      dispatch(editExpense(id, updates));
    })

  }
}

// export const startAddExpense2 = (expenseData={}) =>  dispatch => {
//   const { description='', note='', amount=0, createdAt=0 } = expenseData;
//   const expense = {description, note, amount, createdAt};
//   database.ref('expenses').push(expense).then((ref) => {
//     dispatch({
//       type: 'ADD_EXPENSE',
//       expense: {id: ref.key, ...expense}
//     })
//   })
// }