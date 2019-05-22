import React, { useRef, Children, cloneElement } from "react";
import PropTypes from "prop-types";

const ErrorMsg = props => {
    return (
        <div className="error-msg">
            {props.errorMessage === "function"
                ? props.errorMessage()
                : props.errorMessage}
        </div>
    );
};

const ValidatedForm = props => {
    const form = useRef();

    const _insertAfter = (referenceElement, insersionNode) => {
        // Remove any existing errors
        if (
            referenceElement.nextSibling.classList &&
            referenceElement.nextSibling.classList.contains("error-msg")
        ) {
            referenceElement.nextSibling.remove();
        }
        // Insert the node into the DOM
        const newNode = referenceElement.parentNode.insertBefore(
            insersionNode,
            referenceElement.nextSibling
        );
        return newNode;
    };

    const _showNode = (node, duration) => {
        console.log("node:", node);

        if (duration) {
            setTimeout(() => node.classList.add("visible"), 0);
            setTimeout(() => node.classList.remove("visible"), duration);
            setTimeout(() => node.remove(), duration + 1000);
        } else {
            node.classList.add("visible");
        }
    };

    const _setError = (element, errorMessage, duration, customComponent) => {
        element.classList.add("error");

        let errorNode = customComponent;

        if (!customComponent) {
            errorNode = <ErrorMsg errorMessage={errorMessage} />;
            errorNode.style.width = element.style.width;
            errorNode.style.left = element.offsetLeft + "px";
            _insertAfter(element, errorNode);
        }

        _showNode(errorNode, duration);
    };

    const _getFirstFailure = validator => {
        for (let field in validator) {
            if (validator[field]) {
                return field;
            }
        }
    };

    const _isButton = field => {
        return (
            field.tagName === "button" ||
            field.type === "submit" ||
            field.type === "reset" ||
            field.type === "button"
        );
    };

    /* External functions */
    const submit = e => {
        e.preventDefault();

        const fieldsToCheck = form.current.elements;

        let errorState = false;
        const formFields = {};

        for (let index in fieldsToCheck) {
            if (fieldsToCheck.hasOwnProperty(index)) {
                const field = fieldsToCheck[index];

                if (
                    // Skip buttons
                    _isButton(field)
                )
                    continue;

                if (!field.validity.valid) {
                    errorState = true;
                    const failure = _getFirstFailure(field.validity);
                    _setError(
                        field,
                        props.errorMessages[field.name || field.id || index][
                            failure
                        ],
                        undefined,
                        <ErrorMsg />
                    );
                } else {
                    field.setCustomValidity("");
                    formFields[field.name || field.id || index] = field.value;
                }
            }
        }
        if (!errorState) {
            console.log("Form is valid\ndata:", formFields);
        }
    };

    const createHandler = field => {
        const constraint = props.setCustomConstraint(field);
        const error = props.setCustomError(field);

        if (constraint && error) {
            return e => {
                const localConstraint = new RegExp(
                    constraint,
                    e.target.required ? undefined : ""
                );

                if (localConstraint.test(e.target.value)) {
                    e.target.setCustomValidity("");
                } else {
                    e.target.setCustomValidity(error);
                }
            };
        }
        return undefined;
    };

    const children = Children.map(props.children, child => {
        return cloneElement(child, {
            onClick: _isButton(child) ? submit : undefined,
            onInput: createHandler(child.props.name || child.props.id)
        });
    });

    return (
        <form
            id={props.id}
            name={props.name}
            ref={form}
            className={props.className || "v5-validated-form"}
        >
            {children}
        </form>
    );
};

/* Prop types */
ValidatedForm.propTypes = {
    id: PropTypes.string.isRequired,
    setCustomConstraint: PropTypes.func,
    setCustomError: PropTypes.func,
    customConstraints: PropTypes.object,
    errorMessages: PropTypes.object
};

/* Exports */
export const errorInterface = {
    badInput: "",
    customError: "",
    patternMismatch: "",
    rangeOverflow: "",
    rangeUnderflow: "",
    stepMismatch: "",
    tooLong: "",
    tooShort: "",
    typeMismatch: "",
    valueMissing: ""
};

export const errorMsgInterface = {
    // Allow fully customizable error messages?
    element: PropTypes.element,
    errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    duration: PropTypes.number,
    customComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

export default ValidatedForm;
