import React from "react";
import "./App.css";
import ValidatedForm, { errorInterface } from "./ValidatedForm.jsx";

function App() {
    const country = React.useRef("en");

    var customConstraints = {
        zip: {
            ch: [
                "^(CH-)?\\d{4}$",
                "Switzerland ZIPs must have exactly 4 digits: e.g. CH-1950 or 1950"
            ],
            en: [
                "(GIR 0AA)|((([A-Z-[QVX]][0-9][0-9]?)|(([A-Z-[QVX]][A-Z-[IJZ]][0-9][0-9]?)|(([A-Z-[QVX]][0-9][A-HJKSTUW])|([A-Z-[QVX]][A-Z-[IJZ]][0-9][ABEHMNPRVWXY]))))s?[0-9][A-Z-[CIKMOV]]{2})",
                "England ZIPs must be a combination of letters and digits: e.g. E1, SW1, N19, DA17"
            ],
            fr: [
                "^(F-)?\\d{5}$",
                "France ZIPs must have exactly 5 digits: e.g. F-75012 or 75012"
            ],
            de: [
                "^(D-)?\\d{5}$",
                "Germany ZIPs must have exactly 5 digits: e.g. D-12345 or 12345"
            ],
            nl: [
                "^(NL-)?\\d{4}\\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$",
                "Nederland ZIPs must have exactly 4 digits, followed by 2 letters except SA, SD and SS"
            ],
            us: [
                "^\\d{5}(-\\d{4})?$",
                "American ZIPs must have exactly 5 digits: e.g. 02138 or 45289-1234"
            ]
        },
        country: {}
    };

    const setCustomConstraint = field => {
        return (
            customConstraints[field] &&
            customConstraints[field][country.current] &&
            customConstraints[field][country.current][0]
        );
    };

    const setCustomError = field => {
        return (
            customConstraints[field] &&
            customConstraints[field][country.current] &&
            customConstraints[field][country.current][1]
        );
    };

    // initialize with errorInterface
    const errorMessages = {
        zip: {
            badInput: "badInput constraint validation failed",
            customError: setCustomError("zip"),
            patternMismatch: "patternMismatch constraint validation failed",
            rangeOverflow: "rangeOverflow constraint validation failed",
            rangeUnderflow: "rangeUnderflow constraint validation failed",
            stepMismatch: "stepMismatch constraint validation failed",
            tooLong: "tooLong constraint validation failed",
            tooShort: "tooShort constraint validation failed",
            typeMismatch: "typeMismatch constraint validation failed",
            valueMissing: "Please enter your ZIP code"
        },

        country: {
            valueMissing: "Please enter a country"
        }
    };

    return (
        <div className="App">
            <ValidatedForm
                id="myForm"
                customConstraints={customConstraints}
                setCustomConstraint={setCustomConstraint}
                setCustomError={setCustomError}
                errorMessages={errorMessages}
            >
                <input name="zip" type="text" />
                <select name="country" ref={country}>
                    <option value="">Select one</option>
                    <option value="en">one</option>
                </select>
                <button type="submit">Submit</button>
            </ValidatedForm>
        </div>
    );
}

export default App;
