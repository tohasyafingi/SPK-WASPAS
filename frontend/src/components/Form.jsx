import React, { useState, useEffect } from 'react';
import './Form.css';

/**
 * Komponen Form Generic untuk CRUD
 */
const Form = ({ 
  title = 'Form',
  fields = [], 
  initialData = null,
  onSubmit = null,
  onCancel = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const emptyData = {};
      fields.forEach((field) => {
        emptyData[field.name] = '';
      });
      setFormData(emptyData);
    }
    setErrors({});
  }, [initialData, fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi basic
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} harus diisi`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="form-container" style={{ background: 'transparent', boxShadow: 'none', padding: '0', margin: '0' }}>
      {title && <h2>{title}</h2>}
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="form-group">
            <label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                rows={field.rows || 4}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
              >
                <option value="">-- Pilih --</option>
                {field.options && field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type || 'text'}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                min={field.min}
                max={field.max}
                step={field.step}
              />
            )}
            
            {errors[field.name] && (
              <span className="error-message">{errors[field.name]}</span>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Loading...' : 'Simpan'}
          </button>
          {onCancel && (
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;
