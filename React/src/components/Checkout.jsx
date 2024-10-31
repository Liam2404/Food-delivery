import React, { useEffect, useRef, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const Checkout = ({ total }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const [currency, setCurrency] = useState(options.currency);
    const totalref=useRef(total);

    const onCurrencyChange = ({ target: { value } }) => {
        setCurrency(value);
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: value,
            },
        });
    };

    const onCreateOrder = (data, actions) => {
        const orderTotal = parseFloat(totalref.current);
        console.log("Total pour PayPal:", orderTotal);
        if (orderTotal > 0) {
            return actions.order.create({
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: orderTotal.toFixed(2), 
                        },
                    },
                ],
            });
        } else {
            alert("Le total doit être supérieur à zéro.");
            return Promise.reject(new Error("Total must be greater than zero.")); 
        }
    };

    const onApproveOrder = (data, actions) => {
        return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;
            alert(`Transaction complétée par ${name}`);
        });
    };

    useEffect (() => {
        totalref.current = total;
    }, [total]);

    return (
        <div className="checkout">
            {isPending ? <p>LOADING...</p> : (
                <>
                    <select value={currency} onChange={onCurrencyChange}>
                        <option value="USD">💵 USD</option>
                        <option value="EUR">💶 Euro</option>
                    </select>
                    <PayPalButtons 
                        style={{ layout: "vertical" }}
                        createOrder={(data, actions) => onCreateOrder(data, actions)}
                        onApprove={(data, actions) => onApproveOrder(data, actions)}
                    />
                </>
            )}
        </div>
    );
}

export default Checkout;
