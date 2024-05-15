<?php

use Doctrine\Common\Annotations\AnnotationReader;
use Symfony\Component\Serializer\Encoder\CsvEncoder;
use Symfony\Component\Serializer\Mapping\Factory\ClassMetadataFactory;
use Symfony\Component\Serializer\Mapping\Loader\AttributeLoader;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class CsvService {
    const CSV_HANDLED = 'csv_service_handled';
    const CSV_OPTIONAL = 'csv_service_optional';

    private Serializer $serializer;

    public function __construct() {
        $encoders = [new CsvEncoder()];
        $normalizers = [new ObjectNormalizer(new ClassMetadataFactory(new AttributeLoader(new AnnotationReader())))];

        $this->serializer = new Serializer($normalizers, $encoders);
    }

    public function createModel(string $entityName) {
        return [$this->serializer->serialize(new $entityName(), 'csv', ['groups' => [self::CSV_HANDLED]])];
    }


}