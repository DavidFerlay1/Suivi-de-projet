<?php

namespace App\Controller;

use App\Entity\Main\TenantDb;
use DateTimeImmutable;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityNotFoundException;
use Exception;
use Hakam\MultiTenancyBundle\Doctrine\ORM\TenantEntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AttributeLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class DefaultController extends AbstractController
{
    private $serializer;

    public function __construct(
        protected EntityManagerInterface $mainEm,
        protected TenantEntityManager $em,
        protected EventDispatcherInterface $dispatcher,
    ){
        $encoders = [new JsonEncoder()];
        $normalizers = [new ObjectNormalizer(new ClassMetadataFactory(new AttributeLoader(new AnnotationReader())))];

        $this->serializer = new Serializer($normalizers, $encoders);
    }

    protected function jsonResponse(mixed $data, int $status_code = Response::HTTP_OK, array $groups = []) {
        return new JsonResponse(json_decode($this->serializer->serialize($data, 'json', ['groups' => $groups])), $status_code);
    }

    private function createSubmittable(string $class, mixed &$data) {
        if(isset($data['id']) && $data['id']) {
            $entity = $this->em->getRepository($class)->find($data['id']);
            if(!$entity)
                throw new EntityNotFoundException("$class with id " . $data['id'] . " was not found");
            unset($data['id']);
        } else {
            $entity = new $class();
        }

        return $entity;
    }

    private function handleSubmittableRequest(string $formType, string $entityType, Request|array $request) {
        $data = $request instanceof Request ? $this->getPayload($request) : $request;
        $status = isset($data['id']) ? Response::HTTP_OK : Response::HTTP_CREATED;

        $entity = $this->createSubmittable($entityType, $data);

        $form = $this->createForm($formType, $entity);
        $form->submit($data);

        if($form->isSubmitted() && $form->isValid()) {
            return new SubmittableHandler(true, $entity, $status);
        } 

        return new SubmittableHandler(false, null, $status, $this->manageFormErrors($form->getErrors(true)));
        
    }

    protected function manageFormErrors(FormErrorIterator $formErrors) {
        $errors = [];

        foreach($formErrors as $error) {
            $origin = $error->getOrigin();
            $errors[$origin->getName()] = $error->getMessage();
        }

        return $errors;
    }

    /**
     * 
     * Cette méthode normalise les données reçues d'une requête en vue d'une creation/edition d'une entité et valide ses champs, puis effectue un traitement personnalisé
     * - Dans le cas où la validation échoue, renvoie une 400 avec un tableau sous forme de ["champs" => "message d'erreur"]
     * - Dans le cas où on tente de MODIFIER une entité inexistante, renvoie une 404
     * - Si les données sont validées, on appelle la callback $whenValid passée en paramètre puis on renvoie une 200/201
     * - le contenu de la réponse en cas de réussite est 'ok' par défaut, ou le résultat de la callback $customResponseHandler si il est définit
     * 
     * @param Request $request La requête
     * @param string $formType Le type du form qui validera les données
     * @param string $entityType Le type de l'entité normalisée
     * @param callable $whenValid callback prenant en parametre un SubmittableHandler afin d'effectuer des actions après validation des champs
     * @param callable $customResponseHandler callback facultatif permettant de renvoyer une réponse custom en cas de validation réussie 
     */
    protected function autoSubmitWithBehavior(Request|array $request, string $formType, string $entityType, $options = [], callable $whenValid = null, callable $customResponseHandler = null, callable $execptionInterceptor = null): JsonResponse {
        try {
            $handler = $this->handleSubmittableRequest($formType, $entityType, $request);
            if($handler->isValid()) {
                if($whenValid) {
                    try {
                        $whenValid($handler);
                    } catch (AutoSubmitBehaviorException $e) {
                        if($execptionInterceptor)
                            return $execptionInterceptor();
                        return new JsonResponse('assert.behaviorException', Response::HTTP_BAD_REQUEST);
                    }
                    
                }   
                else {
                    $entity = $handler->getEntity();

                    $em = isset($options['em']) && $options['em'] === EntityManagerInterface::class ? $this->mainEm : $this->em;

                    if($handler->getStatus() === Response::HTTP_CREATED && method_exists($entity, 'setCreatedAt'))
                        $entity->setCreatedAt(new DateTimeImmutable());
                    $em->persist($entity);
                    $em->flush();
                }
                return new JsonResponse($customResponseHandler ? $customResponseHandler($handler) : 'ok', $handler->getStatus());
            }

            return new JsonResponse($handler->getErrors(), Response::HTTP_BAD_REQUEST);

        } catch (EntityNotFoundException $exception) {
            return new JsonResponse('assert.notFound', Response::HTTP_NOT_FOUND);
        }
    }

    protected function getPayload(Request $request) {
        return json_decode($request->getContent(), true);
    }

    protected function getPage(Request $request) {
        $page = $request->get('page');

        if(!$page || !is_numeric($page))
            return null;

        return $page;
    }

    protected function getCurrentTenant(): TenantDb {
        /** @var \App\Entity\Main\Account $account */
        $account = $this->getUser();

        if($account)
            return $account->getTenant();

        return null;
    }
}

class AutoSubmitBehaviorException extends Exception {

}

class SubmittableHandler {
    public function __construct(private bool $valid, private mixed $entity, private $status, private $errors = []){}

    public function isValid() {
        return $this->valid;
    }

    public function getErrors() {
        return $this->errors;
    }

    public function getEntity() {
        return $this->entity;
    }

    public function getStatus() {
        return $this->status;
    }
}
