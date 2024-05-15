<?php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\Request;

class QueryFilterService {

    private $entityName;

    public function __construct(private ParameterBagInterface $params){}

    public function withFieldsFilters(QueryBuilder $qb, string $entityName, array $filters, string $alias = 'entity'): QueryBuilder {
        foreach($filters as $key => $values) {
            if($this->isFieldHandled($entityName, $key)) {
                $setting = $this->getParam($entityName, $key);
                switch($setting['type']) {
                    case 'compare':
                        $qb->andWhere($qb->expr()->in("$alias.".$setting['field_name'], $values));
                        break;
                    default: break;
                }
            }
        }

        return $qb;
    }

    private function getParam(string $entityName, string $param) {
        return $this->params->get("$entityName.$param");
    }

    private function getHandledFields(string $entityName) {
        return array_keys($this->getParam($entityName, 'fields'));
    }

    private function getFieldParams(string $entityName, string $field) {
        return $this->getParam($entityName, "fields.$field");
    }

    private function isFieldHandled(string $entityName, string $field) {
        return in_array($field, $this->getHandledFields($entityName));
    }

    public function handleQueryFilters(Request $request): array {
        return array_filter($request->query->all(), fn(string $entry) => strpos($entry, 'fb_'));
    }
}