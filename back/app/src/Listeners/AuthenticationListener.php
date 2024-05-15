<?php

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;

class AuthenticationListener {
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event) {
        dd($event);
    }
}