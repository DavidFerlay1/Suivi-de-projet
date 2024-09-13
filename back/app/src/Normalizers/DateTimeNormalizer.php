<?php

namespace App\Normalizers\DateTimeNormalizer;

use DateTime;
use DateTimeInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class DateTimeNormalizer implements NormalizerInterface {
    public function normalize(mixed $object, ?string $format = null, array $context = [])
    {
        return $object->getTimestamp() * 1000;
    }

    public function getSupportedTypes($format)
    {
        return [
            DateTime::class => true
        ];
    }

    public function supportsNormalization(mixed $data, ?string $format = null)
    {
        return $data instanceof DateTime;
    }
}