import * as React from "react";
import Select from 'react-select';
import Accordion from "./Accordion";

interface FormField {
  type?: string;
  label?: string;
  name?: string;
  options?: string[];
  columns?: string[];
  data?: any[];
  value?: any;
  required?: any;
  apiUrl?: any; 
  
}

interface DynamicFormProps {
  data: {
    title?: string;
    fields?: FormField[];
  };
  onFormSubmit: (formValues: any) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ data, onFormSubmit }) => {
  const [formValues, setFormValues] = React.useState<any>({});
  const [temporaryFormValues, setTemporaryFormValues] = React.useState<any>({});
  const [apiOptions, setApiOptions] = React.useState<any>({});

  React.useEffect(() => {
    const initialValues = data.fields?.reduce((acc, field) => {
      if (field.name && field.value !== undefined) {
        acc[field.name] = field.value;
      }
      return acc;
    }, {} as { [key: string]: any });

    setFormValues(initialValues || {});
    setTemporaryFormValues(initialValues || {});
  }, []);

  React.useEffect(() => {
    const fetchOptions = async (field: FormField) => {
      if (field.apiUrl) {
        try {
          const response = await fetch(field.apiUrl);
          const options = await response.json();
          setApiOptions(prevOptions => ({ ...prevOptions, [field.name || '']: options }));
        } catch (error) {
          console.error(`Failed to fetch options for ${field.name}:`, error);
        }
      }
    };

    data.fields?.forEach(field => fetchOptions(field));
  }, []);

  const handleChange = (event: any) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked } = target;
      if (name === undefined) return;
      if (type === "checkbox" || type === "radio") {
        setTemporaryFormValues(prevValues => {
          const updatedValues = type === "checkbox" 
            ? prevValues[name] ? [...prevValues[name], value] : [value]
            : { ...prevValues, [name]: value };
          if (type === "checkbox") {
            return { ...prevValues, [name]: prevValues[name].includes(value) ? prevValues[name].filter((v: string) => v !== value) : [...prevValues[name], value] };
          }
          return updatedValues;
        });
      } else {
        setTemporaryFormValues(prevValues => ({
          ...prevValues,
          [name]: value
        }));
      }
    } else if (target instanceof HTMLSelectElement) {
      const { name, value } = target;
      if (name === undefined) return; 
      setTemporaryFormValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, selectedOption: any) => {
    setTemporaryFormValues(prevValues => ({
      ...prevValues,
      [name]: selectedOption ? selectedOption.value : ''
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormValues(temporaryFormValues);  // Move temporary values to formValues
    onFormSubmit(temporaryFormValues);
  };

  const renderField = (field: FormField, index: number) => {
    const name = field.name || '';
    const isRequired = field.required === true;

    switch (field.type) {
      case "text":
      case "number":
      case "date":
      case "time":
        return ( 
          <div className="col-md-6 col-sm-12" key={`${name}-${index}`}>
            <label>{field.label}</label>
            <input
              value={temporaryFormValues[name] || ''}
              type={field.type}
              name={name}
              onChange={handleChange}
              className="form-control"
              style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
              required={isRequired}
            />
          </div>
        );

      case "checkbox-group":
        return (
          <div className="col-md-6 col-sm-12" key={`${name}-${index}`}>
            <label>{field.label}</label>
            <div className="checkbox-group">
              {field.options?.map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="checkbox"
                    name={name}
                    value={option}
                    checked={temporaryFormValues[name]?.includes(option) || false}
                    onChange={handleChange}
                    className="form-check-input"
                    required={isRequired}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div className="col-md-6 col-sm-12" key={`${name}-${index}`}>
            <label>{field.label}</label>
            <Select
              name={name}
              value={temporaryFormValues[name] ? { value: temporaryFormValues[name], label: temporaryFormValues[name] } : null}
              onChange={(selectedOption) => handleSelectChange(name, selectedOption)}
              options={(field.apiUrl ? apiOptions[name] : field.options)?.map(option => ({ value: option, label: option }))}
              className="basic-single"
              classNamePrefix="select"
              isClearable
              required={isRequired}
            />
          </div>
        );

      case "radio-group":
        return (
          <div className="col-md-6 col-sm-12" key={`${name}-${index}`}>
            <label>{field.label}</label>
            <div className="radio-group">
              {field.options?.map((option) => (
                <div key={option} className="form-check">
                  <input
                    type="radio"
                    name={name}
                    value={option}
                    checked={temporaryFormValues[name] === option}
                    onChange={handleChange}
                    className="form-check-input"
                    required={isRequired}
                  />
                  <label className="form-check-label">{option}</label>
                </div>
              ))}
            </div>
          </div>
        );

      case "instruction":
        return (
          <Accordion title="Instruction" key={`${name}-${index}`}>
            <div className="col-md-12" style={{ marginBottom: "10px" }}>
              <ol>
                {field.data?.map((instruction, idx) => (
                  <li key={idx}>{instruction}</li>
                ))}
              </ol>
            </div>
          </Accordion>
        );

      case "table":
        return (
          <Accordion title={field.label} key={`${name}-${index}`}>
            <div className="col-md-12" style={{ marginBottom: "10px" }}>
              <table className="table table-bordered" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    {field.columns?.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {field.data?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {field.columns?.map((column) => (
                        <td key={column}>{row[column]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Accordion>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {data.title && <div className="row title">{data.title}</div>}
      <div className="row">
        {data.fields?.map((field, index) => renderField(field, index))}
      </div>
      <button type="submit" className="btn btn-danger" style={{ margin: "10px" }}>
        Submit
      </button>
      <button type="button" className="btn btn-danger" style={{ margin: "10px" }} onClick={() => console.log('Close')}>
        Close
      </button>
    </form>
  );
};

export default DynamicForm;
