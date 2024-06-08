<?php

namespace App\Service;

use App\Entity\Main\Profile;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\Argument\ServiceLocator;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Encoder\CsvEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AttributeLoader;
use Symfony\Component\Serializer\Normalizer\ArrayDenormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class CsvService {
    const CSV_HANDLED = 'csv_service_handled';
    const CSV_OPTIONAL = 'csv_service_optional';

    private Serializer $serializer;
    private $import_header_assoc = [];
    protected $settings;

    public function __construct(protected ParameterBagInterface $params, protected LocatorService $locator, protected EntityManagerInterface $mainEm) {
        $encoders = [new CsvEncoder(), new JsonEncoder()];
        $normalizers = [new ObjectNormalizer(new ClassMetadataFactory(new AttributeLoader(new AnnotationReader()))), new ArrayDenormalizer()];

        $this->serializer = new Serializer($normalizers, $encoders);
        $this->settings = $this->params->get('csv');
    }

    public function createModel(string $entityName, string $type = 'export') {
        $exportSettings = $this->settings[$type];

        if(!isset($entityName, $exportSettings))
            return [];

        $model = $exportSettings[$entityName];
        $header = [];

        foreach($model['fields'] as $field) {
            $header[] = $field['h_name'];
        }

        return [$header];
    }

    public function addRow(string $className, mixed $entity, array &$model) {
        $exportSettings = $this->settings['export'][$className]['fields'];

        $row = [];

        foreach($exportSettings as $field => $settings) {
            switch($settings['mod']) {
                case "default":
                    $row[] = $entity->{"get".ucfirst($field)}();
                    break;
                case 'delegate':
                    $service = $this->locator->getService($settings['delegated_service']);
                    $row[] = $service->{$settings['delegated_method']}($entity);
                default: break;
            }
        }

        $model[] = $row;
    }

    public function export(string $className, array $entities) {
        $model = $this->createModel($className);
        if(!count($model))
            return $model;

        foreach($entities as $entity) {
            $this->addRow($className, $entity, $model);
        }

        return $this->generateCSV($model);

    }

    public function generateCSV(array $model) {

        $filename = 'export.csv';
        $handle = fopen('php://temp', 'r+');

        foreach($model as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csvContent = stream_get_contents($handle);

        fclose($handle);

        $response = new Response($csvContent);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="'.$filename.'"');

        return $response;
    }

    public function checkCSVImportIntegrity(string $className, array $model) {

        if(!count($model))
            throw new EmptyCSVException();

        $importSettings = $this->settings['import'][$className]['fields'];
        $header_keys = array_keys($model[0]);

        $errors = [];
        foreach($importSettings as $key => $setting) {
            $this->import_header_assoc[$setting['h_name']] = $key;
        }

        foreach(array_diff(array_keys($this->import_header_assoc), array_keys($model[0])) as $diffHeaderName) {
            $errors['missing_fields'][] = $diffHeaderName;
        }

        foreach(array_diff(array_keys($model[0]), array_keys($this->import_header_assoc)) as $index => $diffHeaderName) {
            $errors['extra_fields'][] = $diffHeaderName;
            $header_keys[$index] = '__skip';
        }

        if(isset($errors['missing_fields']))
            return $errors;

        if(count($model) < 2)
            throw new EmptyCSVDataException();

        $dataError = [];

        for($i = 0; $i < count($header_keys); $i++) {
            if($header_keys[$i] === '__skip')
                continue;

            for($j = 0; $j < count($model); $j++) {
                $this->checkCellIntegrity($className, $j, $this->import_header_assoc[$header_keys[$i]], $model[$j][$header_keys[$i]], $dataError);
            }
        }

        if(!empty($dataError))
            $errors['input'] = $dataError;

        return $errors;
    }

    public function checkCellIntegrity(string $className, int $columnIndex, string $field, $cellValue, array &$errors) {
        $setting = $this->settings['import'][$className]['fields'][$field];

        switch($setting['integrity_check']) {
            case 'noEmpty':
                if($cellValue === [] || $cellValue === '' || $cellValue === null) {
                    $errors[] = [
                        "column" => $setting['h_name'],
                        "value" => $cellValue,
                        "line" => $columnIndex,
                        "reason" => "assert.emptyValue"
                    ];
                }
                break;
            case 'identifier':
                if(!filter_var($cellValue, FILTER_VALIDATE_EMAIL)) {
                    $errors[] = [
                        "column" => $setting['h_name'],
                        "value" => $cellValue,
                        "line" => $columnIndex,
                        "reason" => "assert.invalidEmail"
                    ];
                } else if ($this->mainEm->getRepository(Profile::class)->findOneBy(['username' => $cellValue]) !== null) {
                    $errors[] = [
                        "column" => $setting['h_name'],
                        "value" => $cellValue,
                        "line" => $columnIndex,
                        "reason" => "assert.userAlreadyExists"
                    ];
                }
                break;
            case 'boolean':
                if($cellValue != 1 && $cellValue != 0 && $cellValue != '') {
                    $errors[] = [
                        "column" => $setting['h_name'],
                        "value" => $cellValue,
                        "line" => $columnIndex,
                        "reason" => "assert.invalidValue"
                    ];
                }
                break;
            default: break;
        }
    }

    public function deserialize(UploadedFile $file) {
        $data = $this->serializer->decode(file_get_contents($file->getPathname()), CsvEncoder::FORMAT);
        return $data;
    }

    public function normalize(string $className, array $model) {
        $errors = $this->checkCSVImportIntegrity($className, $model);
        $importSettings = $this->settings['import'][$className]['fields'];
 
        $entities = [];

        if(empty($errors)) {
            foreach($model as $row) {
                if(!isset($this->settings['import'][$className]['manage_inheritance']))
                    $entity = new $className();
                else {
                    $inheritanceConfig = $this->settings['import'][$className]['manage_inheritance'];
                    switch($inheritanceConfig['method']) {
                        case 'predicate':
                            $explodedExpression = explode(' ', $inheritanceConfig['predicate']);
                            if($row[$explodedExpression[0]] !== $explodedExpression[1])
                                $entity = new $className();
                            else
                                $entity = new $inheritanceConfig['alt_class']();
                        default: break;
                    }
                }
                
                foreach($row as $field => $cell) {
                    switch($importSettings[$this->import_header_assoc[$field]]['setter']) {
                        default:
                            $entity->{"set".ucfirst($this->import_header_assoc[$field])}($cell);
                            break;
                    }
                }
                
                $entities[] = $entity;
            }
        }

        return $entities;
    }

}

class EmptyCSVException extends Exception {
    public function __construct() {
        parent::__construct("assert.csv.emptyCsv");
    }
}

class EmptyCSVDataException extends Exception {
    public function __construct() {
        parent::__construct("assert.csv.noData");
    }
}