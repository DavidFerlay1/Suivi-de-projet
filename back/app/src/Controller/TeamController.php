<?php

namespace App\Controller;

use App\Entity\Tenant\Team;
use App\Form\TeamType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/project/team')]
class TeamController extends DefaultController
{
    #[Route('', methods:['POST'])]
    public function createUpdate(Request $request) {
        return $this->autoSubmitWithBehavior(
            $request,
            TeamType::class,
            Team::class,
            [],
        );
    }

    #[Route('', methods:['GET'])]
    public function getFilteredList(Request $request) {
        return $this->jsonResponse(
            $this->em->getRepository(Team::class)->getFilteredList($this->getQueryFilters($request)),
            Response::HTTP_OK,
            ['light']
        );
    }
}
