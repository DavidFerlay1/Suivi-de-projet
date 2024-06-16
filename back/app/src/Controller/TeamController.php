<?php

namespace App\Controller;

use App\Entity\Tenant\Team;
use App\Form\TeamType;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        // dd($this->em->getRepository(Team::class)->getFilteredList($this->getQueryFilters($request)));

        return $this->jsonResponse(
            $this->em->getRepository(Team::class)->getFilteredList($this->getQueryFilters($request)),
            Response::HTTP_OK,
            ['light']
        );
    }

    #[Route('/{id}', methods:['DELETE'])]
    public function delete(Team $team) {
        if(!$team)
            return new JsonResponse('bad param', Response::HTTP_BAD_REQUEST);

        $this->em->remove($team);
        $this->em->flush();

        return $this->jsonResponse('ok');
    } 
}
