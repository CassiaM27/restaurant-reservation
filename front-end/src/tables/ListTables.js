import React from "react";

export const ListTables = ({ tables, handleFinish }) => {
  return (
    <div className="col">
      {tables.map((table) => (
        <div className="table border-bottom pb-2" key={table.table_id}>
          <div className="col">
            <div className="row">
              <h4 className="col align-bottom">Table {table.table_name}</h4>
              <div className="col">
                <div>
                  <h5 className="text-center">{table.capacity} seats&nbsp;</h5>
                  {table.occupied 
                  ? (
                    <div className="bg-danger px-2 rounded text-right">
                      <p className="text-white text-center">"Occupied"</p>
                    </div>
                    )
                  : (
                    <div className="bg-success rounded text-right">
                      <p className="text-white text-center">Unoccupied</p>
                    </div>
                    )}
                </div>
              </div>
            </div>
            <div>
              {table.occupied ? (
                <button
                  className="btn btn-primary"
                  onClick={() => handleFinish(table.table_id)}
                >
                  Finish
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListTables;