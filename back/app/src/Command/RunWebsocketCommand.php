<?php

namespace App\Command;

use App\Service\NotificationService;
use App\Service\WebsocketService;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:websocket:run',
    description: 'Lance le serveur websocket Ratchet',
)]
class RunWebsocketCommand extends Command
{
    public function __construct(private WebsocketService $websocketService)
    {
        parent::__construct();
    }

    protected function configure(): void
    {

    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    $this->websocketService
                )
                ),
                8080,
                '0.0.0.0'
        );

        $io->success("Websocket Server Started");

        $server->run();

        $io->warning("Websocket Server Stopped");

        return Command::FAILURE;
    }
}
