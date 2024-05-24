<?php

class QueryFiltersOptions {
    private int|null $maxResult = null;
    private array $excludeValues = [];

    public function setMaxResult(int $maxResult): static {
        $this->maxResult = $maxResult;
        return $this;
    }

    public function setExcludeValues(array $exclude): static {
        $this->excludeValues = $exclude;
        return $this;
    }

    public function getMaxResult(): int|null {
        return $this->maxResult;
    }

    public function getExcludeValues(): array {
        return $this->excludeValues;
    }
}