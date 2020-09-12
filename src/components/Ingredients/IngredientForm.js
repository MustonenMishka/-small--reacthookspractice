import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from "../UI/LoadingIndicator";
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [ titleInput, setTitleInput ] = useState('');
  const [ amountInput, setAmountInput ] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    props.onAddIngr({title: titleInput, amount: amountInput})
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input type="text" id="title"
                   value={titleInput}
                   onChange={e => {
                     const newTitle = e.target.value;
                     setTitleInput(newTitle)}}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input type="number" id="amount"
                   value={amountInput}
                   onChange={e => {
                     const newAmount = e.target.value;
                     setAmountInput(newAmount)}}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
              {props.loading && <LoadingIndicator/>}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
