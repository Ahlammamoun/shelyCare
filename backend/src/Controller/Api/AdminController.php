<?php

namespace App\Controller\Api;

use App\Entity\Product;
use App\Entity\Category;
use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')] // Restreint tout ce controller aux admins
class AdminController extends AbstractController
{
    // --- PRODUITS ---

    #[Route('/products', name: 'admin_products_list', methods: ['GET'])]
    public function listProducts(ProductRepository $repo, Request $request): JsonResponse
    {
        $baseUrl = $request->getSchemeAndHttpHost();

        $products = $repo->findAll();

        $data = array_map(function ($product) use ($baseUrl) {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
                'price' => $product->getPrice(),
                'image' => $product->getImage(),
                'category_id' => $product->getCategory() ? $product->getCategory()->getId() : null,
                'category' => $product->getCategory() ? [
                    'id' => $product->getCategory()->getId(),
                    'name' => $product->getCategory()->getName(),
                ] : null,
                'created_at' => $product->getCreatedAt()?->format('Y-m-d H:i:s'),
            ];
        }, $products);

        return $this->json($data);
    }

    #[Route('/products', name: 'admin_products_create', methods: ['POST'])]
    public function createProduct(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, CategoryRepository $categoryRepo): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $product = new Product();
        $product->setName($data['name'] ?? '');
        $product->setDescription($data['description'] ?? '');
        $product->setPrice($data['price'] ?? 0);
        $product->setImage($data['image'] ?? '');

        if (isset($data['category_id'])) {
            $category = $categoryRepo->find($data['category_id']);
            if (!$category) {
                return $this->json(['message' => 'Catégorie non trouvée'], 400);
            }
            $product->setCategory($category);
        }

        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 400);
        }

        $em->persist($product);
        $em->flush();

        return $this->json(['message' => 'Produit créé', 'id' => $product->getId()], 201);
    }

    #[Route('/products/{id}', name: 'admin_products_update', methods: ['PUT'])]
    public function updateProduct(int $id, Request $request, ProductRepository $repo, EntityManagerInterface $em, ValidatorInterface $validator, CategoryRepository $categoryRepo): JsonResponse
    {
        $product = $repo->find($id);
        if (!$product) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $product->setName($data['name'] ?? $product->getName());
        $product->setDescription($data['description'] ?? $product->getDescription());
        $product->setPrice($data['price'] ?? $product->getPrice());
        $product->setImage($data['image'] ?? $product->getImage());

        if (isset($data['category_id'])) {
            $category = $categoryRepo->find($data['category_id']);
            if (!$category) {
                return $this->json(['message' => 'Catégorie non trouvée'], 400);
            }
            $product->setCategory($category);
        }

        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 400);
        }

        $em->flush();

        return $this->json(['message' => 'Produit mis à jour']);
    }

    #[Route('/products/{id}', name: 'admin_products_delete', methods: ['DELETE'])]
    public function deleteProduct(int $id, ProductRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $product = $repo->find($id);
        if (!$product) {
            return $this->json(['message' => 'Produit non trouvé'], 404);
        }

        $em->remove($product);
        $em->flush();

        return $this->json(['message' => 'Produit supprimé']);
    }

    // --- CATEGORIES ---

    #[Route('/categories', name: 'admin_categories_list', methods: ['GET'])]
    public function listCategories(CategoryRepository $repo): JsonResponse
    {
        $categories = $repo->findAll();

        $data = array_map(fn(Category $cat) => [
            'id' => $cat->getId(),
            'name' => $cat->getName(),
            'slug' => $cat->getSlug(),
        ], $categories);

        return $this->json($data);
    }

    #[Route('/categories', name: 'admin_categories_create', methods: ['POST'])]
    public function createCategory(Request $request, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $category = new Category();
        $category->setName($data['name'] ?? '');

        $errors = $validator->validate($category);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 400);
        }

        $em->persist($category);
        $em->flush();

        return $this->json(['message' => 'Catégorie créée', 'id' => $category->getId()], 201);
    }

    #[Route('/categories/{id}', name: 'admin_categories_update', methods: ['PUT'])]
    public function updateCategory(int $id, Request $request, CategoryRepository $repo, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $category = $repo->find($id);
        if (!$category) {
            return $this->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $category->setName($data['name'] ?? $category->getName());

        $errors = $validator->validate($category);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 400);
        }

        $em->flush();

        return $this->json(['message' => 'Catégorie mise à jour']);
    }

    #[Route('/categories/{id}', name: 'admin_categories_delete', methods: ['DELETE'])]
    public function deleteCategory(int $id, CategoryRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $category = $repo->find($id);
        if (!$category) {
            return $this->json(['message' => 'Catégorie non trouvée'], 404);
        }

        $em->remove($category);
        $em->flush();

        return $this->json(['message' => 'Catégorie supprimée']);
    }
}
