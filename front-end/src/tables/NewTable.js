import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export const NewTable = () => {

    
    const [formData, setFormData] = useState({});
    const history = useHistory();
    
    const initialFormState = {
        table_name: "",
        capacity: "",
    }
    
    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
      }

    const handleSubmit = (event) => {
        event.preventDefault();
        const Abort = new AbortController();

        async function makeTable() {
            try {
                await createTable(formData, Abort.signal)
            }
            catch (error) {
                console.log("error creating table")
            }
            return () => {
                Abort.abort();
            }
        }
        makeTable();
        setFormData(initialFormState);
        console.log("Submitted:", formData)
    }

    return (
        
        <div className="col-8">
            <h1 className="mt-3">New Table</h1>
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
                    value={formData.tableName}
                    required={true}
                />
                <label htmlFor="capacity" className="mt-3">Capacity</label>
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
    )
}

export default NewTable;