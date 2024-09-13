<?php

namespace App\Service;

use App\Entity\Main\Account;
use App\Entity\Tenant\Notification;
use App\Service\NotificationService;
use DateTime;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Ratchet\ConnectionInterface;
use Ratchet\RFC6455\Messaging\MessageInterface;
use Ratchet\WebSocket\MessageComponentInterface;
use SplObjectStorage;
use Throwable;

class WebsocketService implements MessageComponentInterface {
    protected $clients;
    protected $authentications;

    const TYPE_AUTHENTICATE = 'authenticate';
    const TYPE_SYSTEM = 'system';

    public function __construct(private TenantEntityManager $em, private EntityManagerInterface $mainEm, private NotificationService $notificationService, private JWTEncoderInterface $encoder)
    {
        $this->clients = new SplObjectStorage();
        $this->authentications = array();
    }

    public function onOpen(ConnectionInterface $conn)
    {
        $this->clients->attach($conn);
    }

    public function onMessage(ConnectionInterface $conn, MessageInterface $msg)
    {
        $data = json_decode($msg, true);

        switch($data['type']) {
            case self::TYPE_AUTHENTICATE:
                if(isset($data['content']) && is_int($validation = $this->validateToken($data['content']))) {
                    $this->authentications[$validation] = $conn;
                    $conn->send($this->notificationService->create('Authentication OK', Notification::TYPE_AUTENTICATION_SUCCEED));
                } else {
                    $conn->send($this->notificationService->create(json_encode($data), Notification::TYPE_AUTHENTICATION_FAILED));
                }
                break;
            case self::TYPE_SYSTEM:
                $this->sendNotifications($data['notifications']);
                break;
            default: break;
        }
    }

    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        $this->authentications = array_filter($this->authentications, fn($client) => $client != $conn);
    }

    public function onError(ConnectionInterface $conn, Exception $e)
    {
        $conn->close();
    }

    public function sendNotifications(array $notifications) {
        foreach($notifications as $notification) {
            if(isset($this->authentications[$notification['recipientId']])) {
                $this->authentications[$notification['recipientId']]->send(json_encode($notification));
            }
        }
    }

    protected function validateToken(string $token): int|false {
        try {
            $payload = $this->encoder->decode($token);
            if(isset($payload['username'])) {
                $account = $this->mainEm->getRepository(Account::class)->findOneBy(['username' => $payload['username']]);
                if($account)
                    return $account->getId();
            }

            return false;
            
        } catch (Throwable $error) {
            return false;
        }
    }
}