<?php

declare(strict_types=1);

namespace DoctrineMigrations\Main;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240501173126 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE profile CHANGE username username VARCHAR(180) NOT NULL');
        $this->addSql('ALTER TABLE profile RENAME INDEX uniq_8157aa0ff85e0677 TO UNIQ_IDENTIFIER_USERNAME');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE profile CHANGE username username VARCHAR(180) DEFAULT NULL');
        $this->addSql('ALTER TABLE profile RENAME INDEX uniq_identifier_username TO UNIQ_8157AA0FF85E0677');
    }
}
