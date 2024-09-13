<?php

namespace App\Service;

use App\Entity\Main\Account;
use App\Entity\Tenant\Notification;
use DateTimeImmutable;

class NotificationService {
    public function __construct(private AuthService $authService){}

    public function sendNotification(Account $recipient, string $content, string $type = Notification::TYPE_ALERT) {
        $notif = (new Notification())
                        ->setRecipientId($recipient->getId())
                        ->setContent($content)
                        ->setType($type);

    }

    public function create(string $content, string $type = Notification::TYPE_ALERT, bool $json = true) {
        if($json) {
            return json_encode(['type' => $type, 'content' => $content]);
        }

        return (new Notification())->setType($type)->setContent($content)->setCreatedAt(new DateTimeImmutable());
    }
}