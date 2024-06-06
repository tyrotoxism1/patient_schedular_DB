import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ optionArr, onSelectChange }) => {
  const [selectedOption, setSelectedOption] = useState('');

  //Update the selected value to be used for sending to backend
  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelectChange(value);
  };

  //2 types of expected data formats: 
  //format 1: [{key_value: 'value1'},{key_value: 'value2}...] *only has 1 propterty
  //format 2: [{label: 'label_value1', value: 'value_value1'},{label: 'label_value2', value: 'value_value2'},{...}...] *has 2 properties
  //Normalization checks for formats and creates an simple ['value1','value2',...] array from those formats to be displayed in dropdown options
  const normalizeOptions = (options) => {
    //Check incoming data is valid arr and has atleast some value to check for properties 
    if (Array.isArray(options) && options.length > 0) {
      const firstOption = options[0];
      const keys = Object.keys(firstOption);
      if (keys.length === 1) {
        // Data format with a single property
        const singleKey = keys[0];
        return options.map(option => option[singleKey]);
      } else if (keys.includes('value') && keys.includes('label')) {
        // Data format with 'value' and 'label' properties
        return options.map(option => `${option.value} -> ${option.label}`);
      }
    }
    return [];
  };

  const normalizedOptions = normalizeOptions(optionArr);

  return (
    <div style={{ paddingBottom: '10px' }}>
      <select value={selectedOption} onChange={handleSelectChange}>
        <option value="" disabled>Select an option</option> {/* Empty option */}
        {normalizedOptions.length > 0 ? (
          normalizedOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))
        ) : (
          <option value="">Invalid options</option>
        )}
      </select>
    </div>
  );
};

// Set default props
Dropdown.defaultProps = {
  optionArr: [],
  onSelectChange: () => { },
};

// Prop types validation
Dropdown.propTypes = {
  optionArr: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.objectOf(PropTypes.string.isRequired), // For single-property objects
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
      }),
    ])
  ).isRequired,
  onSelectChange: PropTypes.func,
};

export default Dropdown;
