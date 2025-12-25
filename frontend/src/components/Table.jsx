import React from 'react';
import './Table.css';

/**
 * Komponen Table Responsif
 */
const Table = ({ 
  columns, 
  data, 
  onEdit = null, 
  onDelete = null, 
  loading = false,
  error = null,
  editLabel = 'Edit'
}) => {
  if (loading) {
    return <div className="table-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="table-container"><p className="error">{error}</p></div>;
  }

  if (!data || data.length === 0) {
    return <div className="table-container"><p>Tidak ada data</p></div>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {(onEdit || onDelete) && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col) => (
                <td key={`${row.id}-${col.key}`}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="actions">
                  {onEdit && (
                    <button 
                      className="btn-edit"
                      onClick={() => onEdit(row)}
                    >
                      {editLabel}
                    </button>
                  )}
                  {onDelete && (
                    <button 
                      className="btn-delete"
                      onClick={() => onDelete(row.id)}
                    >
                      Hapus
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
