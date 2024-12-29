// Configure Recurly
recurly.configure('ewr1-MetLt2zdPoqf0mwqiB4taf');

// Attach card element
const elements = recurly.Elements();
const cardElement = elements.CardElement();
cardElement.attach('#recurly-elements');

// Handle form submission
document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission behavior

    // Generate Recurly token
    recurly.token(this, async function (err, token) {
        if (err) {
            alert('Payment failed: ' + err.message);
            return;
        }

        // Set Recurly token
        document.getElementById('recurly-token').value = token.id;

        try {
            // Generate reCAPTCHA v3 token
            const recaptchaToken = await grecaptcha.execute('6LfwcrwmAAAAABmMABASDoYJNXJK2DjgPbSVV3xn', { action: 'payment' });

            // Append reCAPTCHA token to the form data
            const formData = new FormData(document.getElementById('payment-form'));
            formData.append('RecaptchaToken', recaptchaToken);

            // Send the form data to the server
            const response = await fetch('/api/IzzyCheckoutApi/process-payment', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorDetails = await response.text();
                throw new Error(`Error: ${response.status}, Message: ${errorDetails}`);
            }

            const result = await response.json();
            if (result.success) {
                alert('Payment successful!');
            } else {
                alert(`Payment failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error during fetch:', error);
            alert(`An error occurred: ${error.message}`);
        }
    });
});
