const express = require('express');
const stripe = require('stripe')('sk_test_51QFipqC5WzPzDwzD9rccO29Zyxatk1Wb3gcwm2NjQTAXCQktsijWPqkJAFp7eMdi6fQgzikoujATdpM0n0U5HpBk00tRHMXFYl'); // Replace with your Stripe secret key
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Create a checkout session
app.post('/create-checkout-session', async (req, res) => {
  const { priceId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription', // or 'payment' for one-time payments
      line_items: [
        {
          price: priceId, // Your Stripe Price ID for the subscription
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success', // Redirect URL on success
      cancel_url: 'http://localhost:3000/cancel',   // Redirect URL on cancel
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(4000, () => console.log('Server running on port 4000'));
