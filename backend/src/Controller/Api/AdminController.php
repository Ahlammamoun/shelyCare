<?php

namespace App\Controller\Api;

use App\Entity\Product;
use App\Entity\Category;
use App\Entity\User;
use App\Repository\ProductRepository;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\Order;
use App\Entity\OrderItem;
use App\Repository\OrderRepository;
use App\Repository\OrderItemRepository;
use Symfony\Component\String\Slugger\SluggerInterface;
use App\Repository\TestimonialRepository;
use App\Entity\Testimonial;




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
    public function createCategory(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        SluggerInterface $slugger
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $category = new Category();
        $name = $data['name'] ?? '';
        $category->setName($name);

        // ➕ Génère le slug à partir du nom
        $slug = strtolower($slugger->slug($name));
        $category->setSlug($slug);

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

    // users //
    #[Route('/users', name: 'admin_users_list', methods: ['GET'])]
    public function listUsers(UserRepository $repo): JsonResponse
    {
        $users = $repo->findAll();
        $data = array_map(fn(User $u) => [
            'id' => $u->getId(),
            'firstname' => $u->getFirstname(),
            'lastname' => $u->getLastname(),
            'email' => $u->getEmail(),
            'roles' => $u->getRoles(),
        ], $users);

        return $this->json($data);
    }

    #[Route('/users/{id}', name: 'admin_users_delete', methods: ['DELETE'])]
    public function deleteUser(int $id, UserRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $user = $repo->find($id);
        if (!$user) {
            return $this->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $em->remove($user);
        $em->flush();

        return $this->json(['message' => 'Utilisateur supprimé']);
    }


    #[Route('/users/{id}', name: 'admin_users_update', methods: ['PUT'], requirements: ['id' => '\d+'])]
    public function updateUser(
        int $id,
        Request $request,
        EntityManagerInterface $em,
        UserRepository $repo,
        UserPasswordHasherInterface $hasher
    ): JsonResponse {
        $user = $repo->find($id);
        if (!$user) {
            return $this->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $user->setEmail($data['email'] ?? $user->getEmail());
        $user->setFirstname($data['firstname'] ?? $user->getFirstname());
        $user->setLastname($data['lastname'] ?? $user->getLastname());
        $user->setRoles($data['roles'] ?? $user->getRoles());

        if (!empty($data['password'])) {
            $hashedPassword = $hasher->hashPassword($user, $data['password']);
            $user->setPassword($hashedPassword);
        }

        $em->flush();

        return $this->json(['message' => 'Utilisateur mis à jour']);
    }

    #[Route('/users', name: 'admin_users_create', methods: ['POST'])]
    public function createUser(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'], $data['firstname'], $data['lastname'])) {
            return $this->json(['error' => 'Champs requis manquants'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setFirstname($data['firstname']);
        $user->setLastname($data['lastname']);
        $user->setRoles($data['roles'] ?? ['ROLE_USER']);

        // Hash le mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $data['password']);
        $user->setPassword($hashedPassword);

        $errors = $validator->validate($user);
        if (count($errors) > 0) {
            $messages = [];
            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }
            return $this->json(['errors' => $messages], 400);
        }

        $em->persist($user);
        $em->flush();

        return $this->json([
            'message' => 'Utilisateur créé avec succès',
            'id' => $user->getId()
        ], 201);
    }


    // orders et orders_item

    #[Route('/orders', name: 'admin_orders_list', methods: ['GET'])]
    public function listOrders(OrderRepository $repo): JsonResponse
    {
        $orders = $repo->findBy([], ['createdAt' => 'DESC']);

        $data = array_map(function (Order $order) {
            $customer = $order->getCustomer();
            return [
                'id' => $order->getId(),
                'customer_email' => $order->getCustomer()?->getEmail(),
                'customer_firstname' => $customer?->getFirstName(),
                'customer_lastname' => $customer?->getLastName(),
                'total' => $order->getTotal(),
                'status' => $order->getStatus(),
                'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
                'stripeSessionId' => $order->getStripeSessionId(),
                'adress' => $order->getShippingAddress(),
            ];
        }, $orders);

        return $this->json($data);
    }

    #[Route('/orders/{id}', name: 'admin_orders_show', methods: ['GET'])]
    public function showOrder(Order $order): JsonResponse
    {
        $items = array_map(function (OrderItem $item) {
            return [
                'product' => $item->getProduct()?->getName(),
                'quantity' => $item->getQuantity(),
                'price' => $item->getPrice(),
                'line_total' => $item->getQuantity() * $item->getPrice(),
            ];
        }, $order->getOrderItems()->toArray());

        return $this->json([
            'id' => $order->getId(),
            'customer' => $order->getCustomer()?->getEmail(),
            'total' => $order->getTotal(),
            'status' => $order->getStatus(),
            'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
            'stripeSessionId' => $order->getStripeSessionId(),
            'items' => $items,
        ]);
    }

    #[Route('/orders/{id}', name: 'admin_orders_update', methods: ['PUT'])]
    public function updateOrder(int $id, Request $request, OrderRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $order = $repo->find($id);
        if (!$order) {
            return $this->json(['message' => 'Commande non trouvée'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $order->setStatus($data['status'] ?? $order->getStatus());

        $em->flush();

        return $this->json(['message' => 'Commande mise à jour']);
    }

    #[Route('/orders/{id}', name: 'admin_order_delete', methods: ['DELETE'])]
    public function deleteOrder(int $id, OrderRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $order = $repo->find($id);
        if (!$order) {
            return $this->json(['message' => 'Commande non trouvée'], 404);
        }

        // Supprimer chaque OrderItem associé à cette commande
        foreach ($order->getOrderItems() as $item) {
            $em->remove($item);
        }

        // Supprimer la commande elle-même
        $em->remove($order);
        $em->flush();

        return $this->json(['message' => 'Commande supprimée']);
    }
    // statistique
    #[Route('/stats', name: 'admin_stats', methods: ['GET'])]
    public function stats(
        OrderRepository $orderRepository,
        UserRepository $userRepository,
        Request $request
    ): JsonResponse {
        $period = $request->query->get('period', 'all');
        $orders = $orderRepository->findAll();

        $now = new \DateTimeImmutable();
        $filteredOrders = [];

        foreach ($orders as $order) {
            $createdAt = $order->getCreatedAt();

            if ($period === 'week' && $createdAt >= $now->modify('-7 days')) {
                $filteredOrders[] = $order;
            } elseif ($period === 'month' && $createdAt >= $now->modify('-1 month')) {
                $filteredOrders[] = $order;
            } elseif ($period === 'year' && $createdAt >= $now->modify('-1 year')) {
                $filteredOrders[] = $order;
            } elseif ($period === 'all') {
                $filteredOrders[] = $order;
            }
        }

        $totalRevenue = 0;
        $totalItems = 0;
        $productNames = [];
        $customers = [];
        $productCounts = [];

        foreach ($filteredOrders as $order) {
            $totalRevenue += $order->getTotal();

            $customer = $order->getCustomer();
            if ($customer) {
                $customers[] = [
                    'firstname' => $customer->getFirstname(),
                    'lastname' => $customer->getLastname(),
                    'email' => $customer->getEmail(),
                ];
            }

            foreach ($order->getOrderItems() as $item) {
                $product = $item->getProduct();
                if ($product) {
                    $productNames[] = $product->getName();
                    $totalItems += $item->getQuantity();

                    $name = $product->getName();
                    $productCounts[$name] = ($productCounts[$name] ?? 0) + $item->getQuantity();
                }
            }
        }

        arsort($productCounts);
        $topProduct = !empty($productCounts) ? array_key_first($productCounts) : null;

        $orderCount = count($filteredOrders);
        $userCount = count($userRepository->findAll());
        $avgBasket = $orderCount > 0 ? round($totalRevenue / $orderCount, 2) : 0;

        return $this->json([
            'revenue' => round($totalRevenue, 2),
            'orders' => $orderCount,
            'users' => $userCount,
            'avgBasket' => $avgBasket,
            'totalItemsSold' => $totalItems,
            'productsOrdered' => array_values(array_unique($productNames)),
            'customers' => array_values(array_unique($customers, SORT_REGULAR)),
            'topProduct' => $topProduct,
            'period' => $period,
        ]);
    }

    // message contact 
    #[Route('/contacts', name: 'admin_contacts_list', methods: ['GET'])]
    public function listContacts(TestimonialRepository $repo): JsonResponse
    {
        $contacts = $repo->createQueryBuilder('t')
            ->where('t.contact IS NOT NULL')
            ->andWhere('t.contact != \'\'')
            ->orderBy('t.id', 'DESC')
            ->getQuery()
            ->getResult();

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'name' => $c->getName(),
            'message' => $c->getMessage(),
            'contact' => $c->getContact(),
            'created_at' => method_exists($c, 'getCreatedAt') && $c->getCreatedAt()
                ? $c->getCreatedAt()->format('Y-m-d H:i:s')
                : null,
        ], $contacts);

        return $this->json($data);
    }


}
