import stripe from 'stripe';
import connection from '../index.js';
stripe('sk_test_51P4hT304leEUj53YNv6UphGjLAhOhjcfBFog2BQNluMjD1tcW8vIo5KCIE4AU8yeg6Z3WyqargzL7pzJsbgWXCrE00pTWXbMSw')
const endpointSecret = 'whsec_5dcff2f8091c0d3dcb2587a0828c931c3260f1da00c03facd79473651b6b2914';



const stripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    }

    catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
    }

    let userId
    let paymentIntent
    let amountPaid
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            paymentIntent = event.data.object;
            amountPaid = paymentIntent.amount / 100; // Convertir le montant en la plus petite unité de la devise (par exemple, centimes en euros)

            // Identifiant de l'utilisateur associé au paiement (par exemple, récupéré à partir de metadata)
            userId = paymentIntent.client_reference_id
            console.log(`Paiement réussi de ${amountPaid} pour l'utilisateur ${userId}`);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            console.log('PaymentMethod was attached to a Customer!');
            break;
        case 'checkout.session.completed':
            paymentIntent = event.data.object;
            amountPaid = paymentIntent.amount_total / 100
            userId = paymentIntent.client_reference_id
            connection.query('UPDATE user SET wallet = wallet + ? WHERE id = ?', [amountPaid, userId], (error, results) => {
                if (error) {
                    console.error('Erreur lors de la mise à jour du portefeuille de l\'utilisateur :', error);
                } else {
                    console.log(`Montant ajouté au portefeuille de l'utilisateur ${userId} : ${amountPaid}`);
                }
            });
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
};

export { stripeWebhook }