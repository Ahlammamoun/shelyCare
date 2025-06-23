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

        // ✅ Vérifie que c’est un tableau avec 'products'
        if (!is_array($data) || !isset($data['products']) || !is_array($data['products'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $productsData = $data['products'];
        $shippingAddress = $data['shippingAddress'] ?? null;

        $order = new Order();
        $order->setCustomer($this->getUser());
        $order->setCreatedAt(new \DateTimeImmutable());
        $order->setStatus('created');

        if ($shippingAddress) {
            $order->setShippingAddress($shippingAddress);
        }

        $total = 0;

        foreach ($productsData as $item) {
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

        // 🚚 Livraison gratuite dès 50 €
        $shippingCost = $total >= 50 ? 0 : 3.9;

        $order->setShippingCost($shippingCost);
        $order->setTotal($total + $shippingCost);

        $em->persist($order);
        $em->flush();



        return new JsonResponse(['orderId' => $order->getId()]);
    }



    #[Route('/api/my-orders', name: 'my_orders', methods: ['GET'])]
    public function myOrders(OrderRepository $orderRepository, Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non autorisé'], 401);
        }

        $baseUrl = $request->getSchemeAndHttpHost(); // ⬅️ Ajouté ici

        $orders = $orderRepository->findBy(['customer' => $user], ['createdAt' => 'DESC']);

        $response = [];
        foreach ($orders as $order) {
            $items = [];
            foreach ($order->getOrderItems() as $item) {
                $product = $item->getProduct();
                $items[] = [
                    'product' => $product->getName(),
                    'quantity' => $item->getQuantity(),
                    'price' => $item->getPrice(),
                    'image' => $product->getImage(),

                ];
            }

            $response[] = [
                'id' => $order->getId(),
                'createdAt' => $order->getCreatedAt()->format('Y-m-d H:i'),
                'total' => $order->getTotal(),
                'shippingCost' => $order->getShippingCost(),
                'products' => $items,

                'image' => isset($items[0]) ? $items[0]['image'] : null,
                'adress' => $order->getShippingAddress(),
                'status' => $order->getStatus(),
            ];
        }

        return new JsonResponse($response);
    }


}
