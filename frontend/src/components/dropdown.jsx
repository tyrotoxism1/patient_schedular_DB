import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ option_arr }) => {
    const [selectedOption, setSelectedOption] = useState('');
    console.log("Dropdown options", option_arr)
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div>
            <select value={selectedOption} onChange={handleSelectChange}>
                {Array.isArray(option_arr) ? (
                    option_arr.map((option) => (
                        <option key={option.value} value={option.value}>
                            Department ID: {option.value} --> {option.label}
                        </option>
                    ))
                ) : (
                    <option value="">Invalid options</option>
                )}
            </select>
            <p>Selected Option: {selectedOption}</p>
        </div>
    );
};

// Set default props
Dropdown.defaultProps = {
    option_arr: [],
};

// Prop types validation
Dropdown.propTypes = {
    option_arr: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Dropdown; 
