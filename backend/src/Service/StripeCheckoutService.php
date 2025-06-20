<?php

namespace App\Service;

use App\Entity\Order;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class StripeCheckoutService
{
    public function __construct(private string $stripeSecretKey)
    {
        Stripe::setApiKey($this->stripeSecretKey);
    }

    public function createCheckoutSession(Order $order): Session
    {
        $lineItems = [];

        foreach ($order->getOrderItems() as $item) {
            $product = $item->getProduct();

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => $product->getName(),
                    ],
                    'unit_amount' => (int) ($item->getPrice() * 100),
                ],
                'quantity' => $item->getQuantity(),
            ];
        }

        if ($order->getShippingCost() > 0) {
            $lineItems[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Frais de livraison',
                    ],
                    'unit_amount' => (int) ($order->getShippingCost() * 100),
                ],
                'quantity' => 1,
            ];
        }
        
        return Session::create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'mode' => 'payment',
            'success_url' => 'http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => 'http://localhost:3000/payment/cancel',

        ]);
    }
}
