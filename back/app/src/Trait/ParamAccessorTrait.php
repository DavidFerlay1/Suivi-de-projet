<?php

namespace App\Trait;

use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

trait ParamAccessorTrait {
    protected ParameterBagInterface $params;

    public function init(ParameterBagInterface $params) {
        $this->params = $params;
    }
}