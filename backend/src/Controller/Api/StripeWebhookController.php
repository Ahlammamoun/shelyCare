<?php

namespace App\Controller\Api;

use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Webhook;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class StripeWebhookController extends AbstractController
{
    #[Route('/webhook/stripe', name: 'stripe_webhook', methods: ['POST'])]
    public function __invoke(
        Request $request,
        OrderRepository $orderRepository,
        EntityManagerInterface $em
    ): Response {
        $secret = $_ENV['STRIPE_WEBHOOK_SECRET'];
        $payload = $request->getContent();
        $signature = $request->headers->get('stripe-signature');

        try {
            $event = Webhook::constructEvent($payload, $signature, $secret);
        } catch (\Exception $e) {
            return new Response('Webhook error: ' . $e->getMessage(), 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $stripeSessionId = $session->id;

            $order = $orderRepository->findOneBy(['stripeSessionId' => $stripeSessionId]);

            if ($order) {
                $order->setStatus('paid');
                $em->flush();
            }
        }

        return new Response('OK', 200);
    }
}
