<?php

namespace App\Service;

use InvalidArgumentException;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LocatorService {
    public function __construct(protected ContainerInterface $locator){}

    public function getService(string $tag) {
        if(!$this->locator->has($tag))
            throw new InvalidArgumentException($tag);

        return $this->locator->get($tag);
    }
}