<?php
// src/DataFixtures/AppFixtures.php

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use \DateTime;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // Ajouter 5 produits de test
        for ($i = 1; $i <= 5; $i++) {
            $product = new Product();
            $product->setName("Produit $i");
            $product->setDescription("Description du produit $i");
            $product->setPrice(mt_rand(10, 50));
            $product->setImage("https://via.placeholder.com/150");
           $product->setCreatedAt(new \DateTime());

            $manager->persist($product);
        }

        $manager->flush();
    }
}
