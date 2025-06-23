<?php

namespace App\Controller\Api;

use App\Entity\Testimonial;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ContactController extends AbstractController
{
    #[Route('/contact', name: 'api_contact_submit', methods: ['POST'])]
    public function contact(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'], $data['email'], $data['message'])) {
            return $this->json(['error' => 'Champs manquants'], 400);
        }

        $testimonial = new Testimonial();
        $testimonial->setName($data['name']);
        $testimonial->setContact($data['email']);
        $testimonial->setMessage($data['message']);
        $testimonial->setRating(0);
        $testimonial->setProducts(null);
        $testimonial->setCreatedAt(new \DateTime());
        
        $em->persist($testimonial);
        $em->flush();

        return $this->json(['success' => 'Message reçu, merci !']);
    }
}
