<?php

namespace App\Controller\Api;

use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\ProductRepository;
use App\Repository\OrderRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

class OrderFromCartController extends AbstractController
{

    #[Route('/api/order-from-cart', name: 'order_from_cart', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function orderFromCart(
        Request $request,
        ProductRepository $productRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!is_array($data) || empty($data)) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $order = new Order();
        $order->setCustomer($this->getUser()); // null si non connecté
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setStatus('created');

        $total = 0;

        foreach ($data as $item) {
            if (!isset($item['id'], $item['quantity'])) {
                continue;
            }

            $product = $productRepository->find($item['id']);
            if (!$product) {
                continue;
            }

            $quantity = max(1, (int) $item['quantity']);
            $price = $product->getPrice();

            $orderItem = new OrderItem();
            $orderItem->setOrder($order);
            $orderItem->setProduct($product);
            $orderItem->setQuantity($quantity);
            $orderItem->setPrice($price);

            $em->persist($orderItem);
            $total += $price * $quantity;
        }

        if ($total === 0) {
            return new JsonResponse(['error' => 'Panier vide ou produits invalides'], 400);
        }

        $order->setTotal($total);
        $em->persist($order);
        $em->flush();

        return new JsonResponse(['orderId' => $order->getId()]);
    }


    #[Route('/api/my-orders', name: 'my_orders', methods: ['GET'])]
    public function myOrders(OrderRepository $orderRepository): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non autorisé'], 401);
        }

        $orders = $orderRepository->findBy(['customer' => $user], ['createdAt' => 'DESC']);

        $response = [];
        foreach ($orders as $order) {
            $items = [];
            foreach ($order->getOrderItems() as $item) {
                $items[] = [
                    'product' => $item->getProduct()->getName(),
                    'quantity' => $item->getQuantity(),
                    'price' => $item->getPrice(),
                ];
            }

            $response[] = [
                'id' => $order->getId(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i'),
                'total' => $order->getTotal(),
                 'products' => $items,
            ];
        }

        return new JsonResponse($response);
    }

}
