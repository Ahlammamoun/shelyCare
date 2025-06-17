<?php

namespace App\Controller\Api;

use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Service\StripeCheckoutService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;

class PaymentController extends AbstractController
{
    #[Route('/checkout/{id}', name: 'checkout')]
    public function checkout(
        int $id,
        OrderRepository $orderRepository,
        StripeCheckoutService $stripeService,
        EntityManagerInterface $em
    ): RedirectResponse {
        $order = $orderRepository->find($id);

        if (!$order) {
            throw $this->createNotFoundException('Commande introuvable');
        }

        $session = $stripeService->createCheckoutSession($order);
        $order->setStripeSessionId($session->id);
        $em->flush();
// dd($session->url);
        return $this->redirect($session->url);
    }
    #[Route('/api/order/by-session/{sessionId}', name: 'order_by_session', methods: ['GET'])]
    public function getOrderBySession(
        string $sessionId,
        OrderRepository $orderRepository
    ): JsonResponse {
        $order = $orderRepository->findOneBy(['stripeSessionId' => $sessionId]);

        if (!$order) {
            return $this->json(['error' => 'Commande introuvable'], 404);
        }

        $items = [];

        foreach ($order->getOrderItems() as $item) {
            $product = $item->getProduct();
            $items[] = [
                'product' => $product ? $product->getName() : 'Produit supprimé',
                'quantity' => $item->getQuantity(),
                'price' => $item->getPrice(),
            ];
        }

        return $this->json([
            'id' => $order->getId(),
            'status' => $order->getStatus(),
            'total' => $order->getTotal(),
            'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i'),
            'items' => $items,
        ]);
    }

}
