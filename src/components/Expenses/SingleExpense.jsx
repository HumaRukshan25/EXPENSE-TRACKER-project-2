import React from "react";

const SingleExpense = (props) => {
  const { id, category, amount, desc, editHandler, deleteHandler } = props;

  return (
    <div>
      <li>
        <i>
          {category}-{amount}-{desc}-
        </i>
        <button onClick={() => editHandler(id)} className="btn">
          Edit
        </button>
        <button onClick={() => deleteHandler(id)} className="btn">
          Delete
        </button>
        {amount >= 1000 && <button>Activate Premium</button>}
      </li>
    </div>
  );
};

export default SingleExpense;
