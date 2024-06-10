// Component from React Table tutorial by "Nikita Dev" on youtube https://www.youtube.com/watch?v=CjqG277Hmgg
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

const DateCell = ({ getValue, row, column, table }) => {
    let date = getValue();
     // Check if the value is already a Date object
    if (!(date instanceof Date) && typeof date === 'string') {
        // Parse the string to create a Date object
        const parsedDate = new Date(date);
        // Check if the parsed date is valid
        if (!isNaN(parsedDate.getTime())) {
            date = parsedDate; // Use the parsed date if it's valid
        } else {
            console.error('Invalid date format:', date);
            // Handle the case where the date format is invalid
        }
    }
    const { updateData } = table.options.meta;
    return (
        <DatePicker
            wrapperClassName="date-wrapper"
            showTimeSelect
            dateFormat='MM/dd/YYYY HH:mm'
            selected={date}
            onChange={
                (date) => updateData(
                    row.index,
                    column.id,
                    date
                )
            }
        >

        </DatePicker>
    )
}
export default DateCell