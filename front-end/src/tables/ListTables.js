import React from "react";

export const ListTables = ({ tables, handleFinish }) => {

  function statusTrueFalse(table) {
    let status = false;

    if(table.status === "occupied") {
      status = true
    }
    return status;
  }
  
  function renderTables () {
    if(tables.length) {
     return tables.map((table) => {
      const status = statusTrueFalse(table)
    
      return (
        <div className="table border-bottom pb-2" key={table.table_id}>
          <div className="col">
            <div className="row">
              <div className="col">
                <h4 className="align-bottom">Table {table.table_name}</h4>
                <div>
                  {table.status ? (
                    <button
                      className="btn btn-primary px-3"
                      data-table-id-finish={table.table_id}
                      onClick={() => handleFinish(table.table_id)}
                    >
                      Finish
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="col">
                <div>
                  <h5 className="text-center">{table.capacity} seats&nbsp;</h5>
                  {status ? (
                    <div className="bg-danger px-2 rounded text-right">
                      <p className="text-white text-center" data-table-id-status={table.table_id}>Occupied</p>
                    </div>
                  ): (
                    <div className="bg-success rounded text-right">
                      <p className="text-white text-center" data-table-id-status={table.table_id}>Unoccupied</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })}
  }
  return <div>{renderTables(tables)}</div>
};

export default ListTables;