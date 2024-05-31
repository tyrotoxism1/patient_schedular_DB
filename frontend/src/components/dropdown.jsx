import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Dropdown = ({ optionArr, onSelectChange, itemLabel=""}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const handleSelectChange = (event) => {
        const value = event.target.value;
        const selectedOptionObject = optionArr.find(option => option.value.toString() === value);
        console.log("handleSelectChange:",value)
        onSelectChange(value);
        setSelectedOption(event.target.value);
    };

    return (
        <div style={{paddingBottom: '10px'}}>
            <select value={selectedOption} onChange={handleSelectChange}>
                {Array.isArray(optionArr) ? (
                    optionArr.map((option) => (
                        <option key={option.value} value={option.value}>
                             {itemLabel}{option.value} --{'>'} {option.label}
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
};

// Prop types validation
Dropdown.propTypes = {
    optionArr: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default Dropdown; 
