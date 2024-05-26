<?php

namespace App\Trait;

use App\Service\LocatorService;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

trait ParamAccessorTrait {
    protected ParameterBagInterface $params;
    protected LocatorService $locator;

    public function initParamAccesses(ParameterBagInterface $params, LocatorService $locator) {
        $this->params = $params;
        $this->locator = $locator;
    }
}