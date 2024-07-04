import { Router } from 'express';
import express from 'express';
import { stripeWebhook } from '../Controller/stripe.js';

const router = Router();

router.post('/',express.raw({ type: 'application/json' }), stripeWebhook)

export default router