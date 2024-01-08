import React, { useState, useEffect, useCallback } from "react";
import SingleExpense from "./SingleExpense";
import { useDispatch } from "react-redux";
import { expenseAction } from "../../store/expense";
import { CSVLink } from "react-csv";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState(0);
  const [desc, setDesc] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [expenseId, setExpenseId] = useState(null);
  const [csvData, setCsv] = useState("No Data");
  const [category, setCategory] = useState("Food");

  const [editedAmount, setEditedAmount] = useState(0);
  const [editedDesc, setEditedDesc] = useState("");
  const [editedCategory, setEditedCategory] = useState("Food");

  const dispatch = useDispatch();
  const email = localStorage.getItem("email");

  const categoryHandler = (e) => {
    setCategory(e.target.value);
  };

  const getExpenses = useCallback(() => {
    fetch(
      `https://expensetracker-5285e-default-rtdb.firebaseio.com//${email}.json`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMsg = "Authentication Failed";
            if (data && data.error && data.error.message) {
              errorMsg = data.error.message;
            }
            throw new Error(errorMsg);
          });
        }
      })
      .then((data) => {
        let arr = [];
        for (let key in data) {
          arr.push({
            id: key,
            desc: data[key].desc,
            amount: data[key].amount,
            category: data[key].category,
          });
        }
        setCsv(arr);
        setExpenses(arr);
        localStorage.setItem("allExpense", JSON.stringify(arr));
        dispatch(expenseAction.addExpenses(arr));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch, email]);

  const initialState = "Food";

  const expenseFormHandler = (e) => {
    e.preventDefault();

    const data = {
      amount: isEdit ? editedAmount : amount,
      desc: isEdit ? editedDesc : desc,
      category: isEdit ? editedCategory : category,
    };

    if (isEdit) {
      fetch(
        `https://expensetracker-5285e-default-rtdb.firebaseio.com//${email}/${expenseId}.json`,
        {
          method: "PUT",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          console.log(res);
          getExpenses();
          setEdit(false);
          setExpenseId(null);
          setEditedAmount(0);
          setEditedDesc("");
          setEditedCategory(initialState);
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      fetch(
        `https://expensetracker-5285e-default-rtdb.firebaseio.com//${email}.json`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          console.log(res);
          setAmount(0);
          setDesc("");
          setCategory(initialState);
          getExpenses();
        })
        .catch((err) => {
          alert(err);
        });
    }

    setExpenses((prevExp) => {
      let newExpense = [...prevExp];
      if (isEdit) {
        newExpense = newExpense.map((expense) =>
          expense.id === expenseId ? { id: expenseId, ...data } : expense
        );
      } else {
        newExpense.push(data);
      }
      return newExpense;
    });
  };

  const editHandler = (id) => {
    let editExpense = expenses.find((expense) => expense.id === id);

    setEdit(true);
    setExpenseId(id);
    setEditedAmount(editExpense.amount);
    setEditedDesc(editExpense.desc);
    setEditedCategory(editExpense.category);
  };

  const deleteHandler = (id) => {
    fetch(
      `https://expensetracker-5285e-default-rtdb.firebaseio.com//${email}/${id}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        console.log(res);
        getExpenses();
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  let header = [
    {
      label: "Amount",
      key: "amount",
    },
    {
      label: "Description",
      key: "desc",
    },
    {
      label: "Category",
      key: "category",
    },
  ];

  return (
    <>
      <div className="form">
        <form onSubmit={expenseFormHandler}>
          <div className="allInput">
            <div className="form-input">
              <h5>Enter Amount</h5>
              <input
                type="number"
                value={isEdit ? editedAmount : amount}
                onChange={(e) => (isEdit ? setEditedAmount(e.target.value) : setAmount(e.target.value))}
              />
            </div>
            <div>
              <h5>ADD DESCRIPTION</h5>
              <input
                type="text"
                value={isEdit ? editedDesc : desc}
                placeholder="Enter description"
                onChange={(e) => (isEdit ? setEditedDesc(e.target.value) : setDesc(e.target.value))}
                required
              />
            </div>
            <div>
              <h5>ADD CATEGORY</h5>
              <select
                className="input"
                id="category"
                onChange={categoryHandler}
                value={isEdit ? editedCategory : category}
              >
                <option value="Food">Food</option>
                <option value="Petrol">Petrol</option>
                <option value="Salary">Salary</option>
              </select>
            </div>
          </div>

          <div>
            <button className="btn">{isEdit ? "Save Expense" : "Add Expense"}</button>
          </div>
        </form>
      </div>
      <div className="form">
        {expenses.map((expense, index) => (
          <SingleExpense
            key={index}
            id={expense.id}
            amount={expense.amount}
            desc={expense.desc}
            category={expense.category}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
          />
        ))}
        <CSVLink data={csvData} headers={header} filename="expense.csv">
          Download Csv
        </CSVLink>
      </div>
    </>
  );
};

export default Expenses;
