<?php

namespace App\Controller;

use App\Entity\Tenant\Project;
use App\Entity\Tenant\Task;
use App\Form\ProjectType;
use App\Form\TaskType;
use DateTimeImmutable;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/project')]
class ProjectController extends DefaultController
{

    #[Route('', methods:['POST'])]
    public function createUpdate(Request $request): JsonResponse
    {
        return $this->autoSubmitWithBehavior($request, ProjectType::class, Project::class);
    }

    #[Route('', methods:['GET'])]
    public function getAll() {
        return $this->jsonResponse($this->em->getRepository(Project::class)->findAllPaginated());
    }

    #[Route('/task', methods:['POST'])]
    public function createUpdateTask(Request $request) {
        return $this->autoSubmitWithBehavior($request, TaskType::class, Task::class);     
    }


    #[Route('/force-achieve', methods:['PUT'])]
    public function forceAchievement(Request $request) {
        $data = json_decode($request->getContent(), true);
    }

}
