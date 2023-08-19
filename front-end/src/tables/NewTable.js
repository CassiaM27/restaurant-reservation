import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ShowAllErrors from "../layout/ShowAllErrors";

export const NewTable = () => {

  const initialFormState = {
    table_name: "",
    capacity: 0,
  }

  const [formData, setFormData] = useState({...initialFormState});
  const [tableErrors, setTableErrors] = useState(null);
  const history = useHistory();

  const handleChange = ({ target }) => {
    if (target.name === "capacity") {
      setFormData({
        ...formData,
        [target.name]: Number(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  }

  function validateTable(table) {
    let errors = [];

    if(table.table_name.length < 2) {
      errors.push("Table name must be at least 2 characters");
    };

    if(!Number.isInteger(table.capacity)) {
      errors.push("Capacity must be a number");
    };

    if(table.capacity === 0) {
      errors.push("Capacity must be 1 or greater");
    };

    return errors;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Abort = new AbortController();

    let errors = validateTable(formData);
    if(errors.length) {
      return setTableErrors(errors);
    }

    try {
      await createTable(formData, Abort.signal)
      history.push("/dashboard")
    }
    catch (error) {
      setTableErrors(error)
    }
    console.log("Submitted:", formData)
    return () => Abort.abort();
  }

  return (
    <>
      <div className="col-8">
        <h1 className="mt-3">Create A New Table</h1>
        <ShowAllErrors errors={tableErrors} />
        <br/>
        <form onSubmit={handleSubmit} className="border p-2">
          <label htmlFor="table_name" className="mt-3">Table Name</label>
          <br/>
          <input 
            className="px-2 mb-2 form-control"
            id="table_name"
            type="text"
            name="table_name"
            onChange={handleChange}
            value={formData.table_name}
            required={true}
          />
          <label htmlFor="capacity" className="mt-3">Table Capacity</label>
          <br/>
          <input
            className="px-2 mb-2 form-control"
            id="capacity"
            type="number"
            name="capacity"
            onChange={handleChange}
            value={formData.capacity}
            required={true}
          />
          <br/>
          <button
            className="btn btn-primary"
            type="submit"
          >
            Submit
          </button>
          <button
            className="btn btn-secondary ml-2"
            type="cancel"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
    )
}

export default NewTable;