<?php

declare(strict_types=1);

namespace DoctrineMigrations\Tenant;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240614063533 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Achievable ADD enableWorkloadTime TINYINT(1) DEFAULT NULL, ADD enableWorkloadWeight TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE Team CHANGE memberIds memberIds JSON NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE Team CHANGE memberIds memberIds LONGTEXT NOT NULL COMMENT \'(DC2Type:array)\'');
        $this->addSql('ALTER TABLE Achievable DROP enableWorkloadTime, DROP enableWorkloadWeight');
    }
}
