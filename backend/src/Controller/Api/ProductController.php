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
        $categoryName = $request->query->get('category');

        if ($categoryName) {
            $products = $productRepository->findByCategoryName($categoryName);
        } else {
            $products = $productRepository->findAll();
        }

        $baseUrl = $request->getSchemeAndHttpHost(); // ex: http://localhost

        $data = array_map(function ($product) use ($baseUrl) {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'category' => $product->getCategory()?->getName(),
                'price' => $product->getPrice(),
                'image' => $baseUrl . '/' . ltrim($product->getImage(), '/'),
                'created_at' => $product->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $products);

        return $this->json($data);
    }

    #[Route('/api/products/{id}', name: 'api_product_show', methods: ['GET'])]
    public function show(int $id, ProductRepository $productRepository, Request $request): JsonResponse
    {
        $product = $productRepository->find($id);

        if (!$product) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

        $baseUrl = $request->getSchemeAndHttpHost();

        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'image' => $baseUrl . '/' . ltrim($product->getImage(), '/'),
            'created_at' => $product->getCreatedAt()?->format('Y-m-d H:i:s'),
            'category' => $product->getCategory()?->getName(),
        ]);
    }



}
