<?php

namespace App\Models;

class QueryFiltersOptions {
    private int|null $maxResult = null;
    private array $excludeValues = [];
    private array $predicates = [];

    public function setMaxResult(int $maxResult): static {
        $this->maxResult = $maxResult;
        return $this;
    }

    public function setExcludeValues(array $exclude): static {
        $this->excludeValues = $exclude;
        return $this;
    }

    public function addPredicate(string $predicate): static {
        $this->predicates[] = $predicate;
        return $this;
    }

    public function getPredicates(): array {
        return $this->predicates;
    }

    public function getMaxResult(): int|null {
        return $this->maxResult;
    }

    public function getExcludeValues(): array {
        return $this->excludeValues;
    }
}