<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Psr\Log\LoggerInterface;

class LoginController extends AbstractController
{
    #[Route('/api/login', name: 'custom_login', methods: ['POST'])]
    public function login(
        Request $request,
        UserProviderInterface $userProvider,
        UserPasswordHasherInterface $passwordHasher,
        JWTTokenManagerInterface $JWTManager
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            $user = $userProvider->loadUserByIdentifier($data['email'] ?? '');

            if (!$user || !$passwordHasher->isPasswordValid($user, $data['password'] ?? '')) {
                return new JsonResponse(['error' => 'Identifiants invalides'], 401);
            }
// dd($user);
            // 🔍 Le suspect n°1 : JWT creation
            $token = $JWTManager->create($user);

            return new JsonResponse(['token' => $token]);
        } catch (\Throwable $e) {
            // ✅ Log dans les logs + retour JSON de l'erreur
            file_put_contents('php://stderr', $e->getMessage() . "\n" . $e->getTraceAsString());
            return new JsonResponse([
                'error' => 'Erreur interne',
                'message' => $e->getMessage()
            ], 500);
        }
    }


 


}
