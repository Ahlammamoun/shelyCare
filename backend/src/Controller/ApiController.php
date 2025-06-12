<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiController
{
    #[Route('/api/ping', name: 'api_ping')]
    public function ping(): JsonResponse
    {
        return new JsonResponse(['message' => 'pong']);
    }
}
