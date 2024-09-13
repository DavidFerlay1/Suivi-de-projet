<?php

namespace App\Service;

use App\Service\WebsocketService;
use Ratchet\Client\Websocket;
use Symfony\Component\Serializer\SerializerInterface;
use WebSocket\Client;

class WebsocketClient {
    private $client;

    public function __construct(string $url, private SerializerInterface $serializer)
    {
        $this->client = new Client($url);
    }

    public function sendNotifications(array $notifications) {
        $this->client->send($this->serializer->serialize([
            "type" => WebsocketService::TYPE_SYSTEM,
            "notifications" => $notifications 
        ], 'json'));
    }

    public function sendMessage(string $content, string $type, array $accounts) {
        $this->client->send(json_encode(
            [
                'type' => WebsocketService::TYPE_SYSTEM,
                'notification_type' => $type,
                'recipients' => $accounts,
                'content' => $content,
            ]
        ));
    }
}