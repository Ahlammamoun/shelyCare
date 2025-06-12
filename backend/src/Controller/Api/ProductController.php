<?php

namespace App\Controller\Api;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    #[Route('/api/products', name: 'api_products', methods: ['GET'])]
    public function index(ProductRepository $productRepository, Request $request): JsonResponse
    {
        $products = $productRepository->findAll();

        $baseUrl = $request->getSchemeAndHttpHost(); // http://localhost

        $data = array_map(function ($product) use ($baseUrl) {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'image' => $baseUrl . '/' . ltrim($product->getImage(), '/'), // <-- chemin complet
                'created_at' => $product->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $products);

        return $this->json($data);
    }
}
